import re
from collections.abc import Iterable

from app.schemas import alumbrado as schemas

METODOLOGIA = "CREG 101 013 de 2022"
EFICACIA_REFERENCIA = 130.0
FAOMS_MARINO = 0.005

FAOML_BY_YEAR = {
    2022: 0.097,
    2023: 0.092,
    2024: 0.086,
    2025: 0.080,
    2026: 0.074,
    2027: 0.069,
}
FAOML_MIN_2028 = 0.063


def get_faoml_for_year(year: int) -> float:
    if year >= 2028:
        return FAOML_MIN_2028
    return FAOML_BY_YEAR.get(year, FAOML_BY_YEAR[2022])


def _money(value: float) -> float:
    return round(value, 2)


def _annualization_factor(rate: float, useful_life: int) -> float:
    if useful_life <= 0:
        raise ValueError("vida_util_anios debe ser mayor a cero")
    if rate == 0:
        return 1.0 / useful_life
    denominator = 1 - (1 + rate) ** (-useful_life)
    if denominator == 0:
        raise ValueError("No fue posible calcular el factor de anualización")
    return rate / denominator


def _sanitize_receipt_fragment(value: str) -> str:
    normalized = re.sub(r"[^A-Za-z0-9]", "", value).upper()
    return normalized[:10] or "MUNICIPIO"


def _to_level_map(values: Iterable, attr_name: str) -> dict[int, object]:
    level_map: dict[int, object] = {}
    for value in values:
        level = getattr(value, attr_name)
        if level in level_map:
            raise ValueError(f"Nivel de tensión duplicado: {level}")
        level_map[level] = value
    return level_map


def calculate_alumbrado_costs(
    payload: schemas.AlumbradoCalculoEntrada,
    tenant_id: str,
) -> schemas.AlumbradoCalculoResultado:
    alerts: list[str] = []

    energy_level_map = _to_level_map(payload.energia_niveles, "nivel_tension")
    investment_level_map = _to_level_map(payload.inversion_niveles, "nivel_tension")
    aom_level_map = _to_level_map(payload.aom_niveles, "nivel_tension")

    # 1) CSEE
    csee_total = 0.0
    energy_results: list[schemas.EnergiaNivelResultado] = []
    for level in sorted(energy_level_map):
        item = energy_level_map[level]
        cee_aforado = sum(
            aforo.carga_kw * aforo.horas_diarias * aforo.dias_facturacion
            for aforo in item.aforos
        )
        if payload.usar_formulacion_mixta_cee:
            cee_total_kwh = item.cee_medido_kwh + cee_aforado
        else:
            cee_total_kwh = item.cee_medido_kwh if item.cee_medido_kwh > 0 else cee_aforado
        csee_n = item.tee * cee_total_kwh
        csee_total += csee_n
        energy_results.append(
            schemas.EnergiaNivelResultado(
                nivel_tension=level,
                tee=_money(item.tee),
                cee_medido_kwh=_money(item.cee_medido_kwh),
                cee_aforado_kwh=_money(cee_aforado),
                cee_total_kwh=_money(cee_total_kwh),
                csee_n=_money(csee_n),
            )
        )

    # 2) ID
    id_penalty = sum(
        (event.potencia_kw * event.horas_sin_servicio)
        / (payload.disponibilidad.potencia_total_kw * payload.disponibilidad.horas_periodo)
        for event in payload.disponibilidad.eventos
    )
    id_value = 1 - id_penalty
    if id_value < 0:
        alerts.append("El índice de disponibilidad calculado fue menor a 0; se ajustó a 0")
        id_value = 0.0
    if id_value > 1:
        alerts.append("El índice de disponibilidad calculado fue mayor a 1; se ajustó a 1")
        id_value = 1.0

    # 3) CINV
    cinv_total = 0.0
    investment_results: list[schemas.InversionNivelResultado] = []
    for level in sorted(investment_level_map):
        item = investment_level_map[level]
        caae_n = 0.0
        for ucap in item.ucap:
            annualization = _annualization_factor(payload.tasa_retorno, ucap.vida_util_anios)
            cr_l_adjusted = 0.0
            if ucap.cr_l_base > 0:
                cr_l_adjusted = (ucap.eficacia_lm_w / EFICACIA_REFERENCIA) * ucap.cr_l_base
            caae_n += (ucap.cr_i + cr_l_adjusted) * annualization

        cat_n = item.porcentaje_terreno * sum(
            terreno.area_m2 * terreno.valor_catastral_m2 for terreno in item.terrenos
        )
        caane_n = payload.ne_fraccion * caae_n
        caa_n = caae_n + cat_n + caane_n
        cinv_n = caa_n * id_value
        cinv_total += cinv_n

        investment_results.append(
            schemas.InversionNivelResultado(
                nivel_tension=level,
                caae_n=_money(caae_n),
                cat_n=_money(cat_n),
                caane_n=_money(caane_n),
                caa_n=_money(caa_n),
                cinv_n=_money(cinv_n),
            )
        )

    # 4) CAOM
    faoml = get_faoml_for_year(payload.anno_aplicacion)
    faoms = FAOMS_MARINO if payload.ambiente_marino else 0.0
    cral_total = sum(item.cral_n for item in payload.aom_niveles)

    caom_total = 0.0
    aom_results: list[schemas.AOMNivelResultado] = []
    for level in sorted(aom_level_map):
        item = aom_level_map[level]
        energy_item = energy_level_map.get(level)
        if not energy_item:
            raise ValueError(
                f"No existe TEE para nivel de tensión {level}; "
                "se requiere para calcular VCEEI_n"
            )

        vceei_n = energy_item.tee * sum(
            event.potencia_kw * event.horas_indisponibilidad
            for event in item.vceei_eventos
        )
        crta_n = item.cra_n + item.cral_n
        caom_n = (
            (
                (item.cra_n * payload.faom_n)
                + (cral_total * faoml)
                + (crta_n * faoms)
            )
            * id_value
            - vceei_n
        )
        caom_total += caom_n
        aom_results.append(
            schemas.AOMNivelResultado(
                nivel_tension=level,
                vceei_n=_money(vceei_n),
                crta_n=_money(crta_n),
                caom_n=_money(caom_n),
            )
        )

    # 5) COTR
    cotr_total = (
        payload.cotr.interventoria
        + payload.cotr.costos_ambientales
        + payload.cotr.polizas
        + payload.cotr.tramites_impuestos
        + payload.cotr.otros
    )

    max_environmental_cost = max(caom_total, 0) * 0.05
    if payload.cotr.costos_ambientales > max_environmental_cost + 1e-9:
        raise ValueError(
            "Los costos ambientales no pueden exceder el 5% del CAOM "
            f"(límite: {max_environmental_cost:.2f})"
        )

    # 6) CAP
    cap_total = csee_total + cinv_total + caom_total + cotr_total

    # 7) Actualización por IPP (opcional)
    ipp_result: schemas.ActualizacionIPPResultado | None = None
    if payload.actualizacion_ipp:
        factor_ipp = (
            payload.actualizacion_ipp.ipp_mes_anterior
            / payload.actualizacion_ipp.ipp_base
        )
        cinv_updated = cinv_total * factor_ipp
        caom_updated = caom_total * factor_ipp
        cap_updated = csee_total + cinv_updated + caom_updated + cotr_total
        ipp_result = schemas.ActualizacionIPPResultado(
            factor_ipp=_money(factor_ipp),
            cinv_actualizado=_money(cinv_updated),
            caom_actualizado=_money(caom_updated),
            cap_actualizado=_money(cap_updated),
        )

    # 8) Recibo
    municipio_fragment = _sanitize_receipt_fragment(payload.municipio)
    periodo_fragment = _sanitize_receipt_fragment(payload.periodo)
    receipt_number = f"REC-{municipio_fragment}-{periodo_fragment}"
    receipt = schemas.ReciboResultado(
        numero_recibo=receipt_number,
        municipio=payload.municipio,
        periodo=payload.periodo,
        metodologia=METODOLOGIA,
        lineas=[
            schemas.ReciboLinea(concepto="CSEE", valor=_money(csee_total)),
            schemas.ReciboLinea(concepto="CINV", valor=_money(cinv_total)),
            schemas.ReciboLinea(concepto="CAOM", valor=_money(caom_total)),
            schemas.ReciboLinea(concepto="COTR", valor=_money(cotr_total)),
        ],
        total=_money(cap_total),
    )

    return schemas.AlumbradoCalculoResultado(
        tenant_id=tenant_id,
        metodologia=METODOLOGIA,
        municipio=payload.municipio,
        periodo=payload.periodo,
        anno_aplicacion=payload.anno_aplicacion,
        id_disponibilidad=_money(id_value),
        faoml=_money(faoml),
        faoms=_money(faoms),
        csee=_money(csee_total),
        cinv=_money(cinv_total),
        caom=_money(caom_total),
        cotr=_money(cotr_total),
        cap=_money(cap_total),
        energia_niveles=energy_results,
        inversion_niveles=investment_results,
        aom_niveles=aom_results,
        recibo=receipt,
        actualizacion_ipp=ipp_result,
        alertas=alerts,
    )

