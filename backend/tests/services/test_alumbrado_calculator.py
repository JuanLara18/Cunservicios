import pytest

from app.schemas.alumbrado import AlumbradoCalculoEntrada
from app.services.alumbrado_calculator import calculate_alumbrado_costs, get_faoml_for_year


def build_payload(costos_ambientales: float = 5.0) -> AlumbradoCalculoEntrada:
    return AlumbradoCalculoEntrada(
        municipio="Alcaldía de Prueba",
        periodo="2026-01",
        anno_aplicacion=2026,
        tasa_retorno=0.1,
        energia_niveles=[
            {
                "nivel_tension": 1,
                "tee": 100,
                "cee_medido_kwh": 10,
                "aforos": [
                    {
                        "clase_iluminacion": 1,
                        "carga_kw": 1,
                        "horas_diarias": 2,
                        "dias_facturacion": 3,
                    }
                ],
            },
            {
                "nivel_tension": 2,
                "tee": 200,
                "cee_medido_kwh": 5,
                "aforos": [],
            },
        ],
        inversion_niveles=[
            {
                "nivel_tension": 1,
                "ucap": [
                    {
                        "cr_i": 1000,
                        "cr_l_base": 130,
                        "eficacia_lm_w": 130,
                        "vida_util_anios": 1,
                    }
                ],
                "terrenos": [{"area_m2": 10, "valor_catastral_m2": 100}],
            },
            {
                "nivel_tension": 2,
                "ucap": [
                    {
                        "cr_i": 500,
                        "cr_l_base": 0,
                        "vida_util_anios": 1,
                    }
                ],
                "terrenos": [],
            },
        ],
        disponibilidad={
            "potencia_total_kw": 10,
            "horas_periodo": 100,
            "eventos": [{"potencia_kw": 1, "horas_sin_servicio": 10}],
        },
        aom_niveles=[
            {
                "nivel_tension": 1,
                "cra_n": 700,
                "cral_n": 300,
                "vceei_eventos": [{"potencia_kw": 0.1, "horas_indisponibilidad": 1}],
            },
            {
                "nivel_tension": 2,
                "cra_n": 300,
                "cral_n": 200,
                "vceei_eventos": [],
            },
        ],
        cotr={
            "interventoria": 20,
            "costos_ambientales": costos_ambientales,
            "polizas": 10,
            "tramites_impuestos": 5,
            "otros": 0,
        },
        actualizacion_ipp={"ipp_base": 100, "ipp_mes_anterior": 110},
    )


def test_get_faoml_by_year():
    assert get_faoml_for_year(2022) == pytest.approx(0.097)
    assert get_faoml_for_year(2026) == pytest.approx(0.074)
    assert get_faoml_for_year(2030) == pytest.approx(0.063)


def test_calculate_alumbrado_costs():
    payload = build_payload()
    result = calculate_alumbrado_costs(payload=payload, tenant_id="public")

    assert result.metodologia == "CREG 101 013 de 2022"
    assert result.id_disponibilidad == pytest.approx(0.99, rel=1e-4)
    assert result.csee == pytest.approx(2600.00, rel=1e-4)
    assert result.cinv == pytest.approx(1916.16, rel=1e-4)
    assert result.caom == pytest.approx(102.86, rel=1e-4)
    assert result.cotr == pytest.approx(40.00, rel=1e-4)
    assert result.cap == pytest.approx(4659.02, rel=1e-4)
    assert result.actualizacion_ipp is not None
    assert result.actualizacion_ipp.factor_ipp == pytest.approx(1.10, rel=1e-4)
    assert result.recibo.total == pytest.approx(result.cap)


def test_environmental_cost_limit():
    payload = build_payload(costos_ambientales=20.0)
    with pytest.raises(ValueError, match="costos ambientales"):
        calculate_alumbrado_costs(payload=payload, tenant_id="public")

