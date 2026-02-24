import re

from app.schemas import alumbrado as schemas


def _sanitize_fragment(value: str) -> str:
    normalized = re.sub(r"[^A-Za-z0-9]", "", value).upper()
    return normalized[:10] or "MUNICIPIO"


def _money(value: float) -> float:
    return round(value, 2)


def _money_str(value: float) -> str:
    return f"${value:,.2f}"


def _build_receipt_number(municipio: str, periodo: str) -> str:
    municipio_fragment = _sanitize_fragment(municipio)
    periodo_fragment = _sanitize_fragment(periodo)
    return f"REC-{municipio_fragment}-{periodo_fragment}"


def _build_text_content(
    numero_recibo: str,
    tenant_id: str,
    municipio: str,
    periodo: str,
    metodologia: str,
    metadata: schemas.ReciboSimpleMetadataEntrada,
    componentes: schemas.ReciboComponentesEntrada,
    total: float,
) -> str:
    lines = [
        "RECIBO SIMPLE - ALUMBRADO PUBLICO",
        f"Numero: {numero_recibo}",
        f"Tenant: {tenant_id}",
        f"Municipio: {municipio}",
        f"Periodo: {periodo}",
        f"Metodologia: {metodologia}",
        f"Entidad facturadora: {metadata.entidad_facturadora}",
        f"Fuente de datos: {metadata.fuente_datos}",
        "",
        f"CSEE: {_money_str(componentes.csee)}",
        f"CINV: {_money_str(componentes.cinv)}",
        f"CAOM: {_money_str(componentes.caom)}",
        f"COTR: {_money_str(componentes.cotr)}",
        f"TOTAL CAP: {_money_str(total)}",
    ]

    if metadata.nit:
        lines.insert(7, f"NIT: {metadata.nit}")
    if metadata.direccion:
        lines.insert(8, f"Direccion: {metadata.direccion}")
    if metadata.contacto:
        lines.insert(9, f"Contacto: {metadata.contacto}")
    if metadata.observaciones:
        lines.extend(["", f"Observaciones: {metadata.observaciones}"])

    return "\n".join(lines)


def _build_markdown_content(
    numero_recibo: str,
    tenant_id: str,
    municipio: str,
    periodo: str,
    metodologia: str,
    metadata: schemas.ReciboSimpleMetadataEntrada,
    componentes: schemas.ReciboComponentesEntrada,
    total: float,
) -> str:
    extra_fields = []
    if metadata.nit:
        extra_fields.append(f"- **NIT:** {metadata.nit}")
    if metadata.direccion:
        extra_fields.append(f"- **Dirección:** {metadata.direccion}")
    if metadata.contacto:
        extra_fields.append(f"- **Contacto:** {metadata.contacto}")

    extras = "\n".join(extra_fields)
    if extras:
        extras += "\n"

    observation = (
        f"\n**Observaciones:** {metadata.observaciones}\n" if metadata.observaciones else ""
    )

    return (
        f"# Recibo simple de alumbrado público\n\n"
        f"- **Número:** {numero_recibo}\n"
        f"- **Tenant:** {tenant_id}\n"
        f"- **Municipio:** {municipio}\n"
        f"- **Período:** {periodo}\n"
        f"- **Metodología:** {metodologia}\n"
        f"- **Entidad facturadora:** {metadata.entidad_facturadora}\n"
        f"- **Fuente de datos:** {metadata.fuente_datos}\n"
        f"{extras}\n"
        f"## Componentes CAP\n\n"
        f"| Concepto | Valor |\n"
        f"|---|---:|\n"
        f"| CSEE | {_money_str(componentes.csee)} |\n"
        f"| CINV | {_money_str(componentes.cinv)} |\n"
        f"| CAOM | {_money_str(componentes.caom)} |\n"
        f"| COTR | {_money_str(componentes.cotr)} |\n"
        f"| **TOTAL CAP** | **{_money_str(total)}** |\n"
        f"{observation}"
    )


def build_simple_receipt(
    tenant_id: str,
    municipio: str,
    periodo: str,
    metodologia: str,
    metadata: schemas.ReciboSimpleMetadataEntrada,
    componentes: schemas.ReciboComponentesEntrada,
) -> schemas.ReciboSimpleResultado:
    total = _money(componentes.csee + componentes.cinv + componentes.caom + componentes.cotr)
    receipt_number = _build_receipt_number(municipio, periodo)
    text_content = _build_text_content(
        numero_recibo=receipt_number,
        tenant_id=tenant_id,
        municipio=municipio,
        periodo=periodo,
        metodologia=metodologia,
        metadata=metadata,
        componentes=componentes,
        total=total,
    )
    markdown_content = _build_markdown_content(
        numero_recibo=receipt_number,
        tenant_id=tenant_id,
        municipio=municipio,
        periodo=periodo,
        metodologia=metodologia,
        metadata=metadata,
        componentes=componentes,
        total=total,
    )

    return schemas.ReciboSimpleResultado(
        numero_recibo=receipt_number,
        tenant_id=tenant_id,
        metodologia=metodologia,
        municipio=municipio,
        periodo=periodo,
        entidad_facturadora=metadata.entidad_facturadora,
        fuente_datos=metadata.fuente_datos,
        componentes=schemas.ReciboComponentesEntrada(
            csee=_money(componentes.csee),
            cinv=_money(componentes.cinv),
            caom=_money(componentes.caom),
            cotr=_money(componentes.cotr),
        ),
        total=total,
        contenido_texto=text_content,
        contenido_markdown=markdown_content,
    )

