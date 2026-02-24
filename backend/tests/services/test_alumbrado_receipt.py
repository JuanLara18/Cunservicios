from app.schemas import alumbrado as schemas
from app.services.alumbrado_receipt import build_simple_receipt


def test_build_simple_receipt():
    metadata = schemas.ReciboSimpleMetadataEntrada(
        entidad_facturadora="Cunservicios",
        fuente_datos="plantilla_manual_v1",
        nit="900000000-0",
    )
    components = schemas.ReciboComponentesEntrada(
        csee=1000,
        cinv=2000,
        caom=3000,
        cotr=400,
    )

    result = build_simple_receipt(
        tenant_id="public",
        municipio="Alcaldía de Prueba",
        periodo="2026-01",
        metodologia="CREG 101 013 de 2022",
        metadata=metadata,
        componentes=components,
    )

    assert result.total == 6400
    assert result.numero_recibo.startswith("REC-")
    assert "CAP" in result.contenido_texto
    assert "| Concepto | Valor |" in result.contenido_markdown

