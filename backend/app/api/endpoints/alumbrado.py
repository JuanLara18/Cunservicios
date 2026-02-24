from app.api.tenant import get_tenant_id
from app.schemas import alumbrado as schemas
from app.services.alumbrado_calculator import (
    FAOMS_MARINO,
    METODOLOGIA,
    calculate_alumbrado_costs,
    get_faoml_for_year,
)
from app.services.alumbrado_receipt import build_simple_receipt
from fastapi import APIRouter, Depends, HTTPException, Query

router = APIRouter(prefix="/alumbrado", tags=["alumbrado"])


@router.get("/parametros")
def read_alumbrado_parameters(
    anno: int = Query(..., ge=2022),
):
    return {
        "metodologia": METODOLOGIA,
        "anno": anno,
        "faom_n": 0.04,
        "faoml": get_faoml_for_year(anno),
        "faoms_marino": FAOMS_MARINO,
        "ne_fraccion": 0.041,
        "eficacia_referencia_lm_w": 130,
        "porcentaje_terreno": 0.069,
        "tope_costos_ambientales_sobre_caom": 0.05,
    }


@router.post("/calcular", response_model=schemas.AlumbradoCalculoResultado)
def calculate_alumbrado(
    payload: schemas.AlumbradoCalculoEntrada,
    tenant_id: str = Depends(get_tenant_id),
):
    try:
        return calculate_alumbrado_costs(payload=payload, tenant_id=tenant_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/recibo/plantilla")
def get_simple_receipt_template():
    return {
        "municipio": "Nombre del municipio",
        "periodo": "2026-01",
        "metodologia": "CREG 101 013 de 2022",
        "componentes": {
            "csee": 0,
            "cinv": 0,
            "caom": 0,
            "cotr": 0,
        },
        "metadata": {
            "entidad_facturadora": "Cunservicios",
            "nit": "900000000-0",
            "direccion": "Dirección",
            "contacto": "correo@empresa.com",
            "fuente_datos": "plantilla_manual_v1",
            "observaciones": "Opcional",
        },
    }


@router.post(
    "/recibo/simple/desde-plantilla",
    response_model=schemas.ReciboSimpleResultado,
)
def create_simple_receipt_from_template(
    payload: schemas.ReciboSimpleDesdePlantillaEntrada,
    tenant_id: str = Depends(get_tenant_id),
):
    return build_simple_receipt(
        tenant_id=tenant_id,
        municipio=payload.municipio,
        periodo=payload.periodo,
        metodologia=payload.metodologia,
        metadata=payload.metadata,
        componentes=payload.componentes,
    )


@router.post(
    "/recibo/simple/desde-calculo",
    response_model=schemas.ReciboSimpleResultado,
)
def create_simple_receipt_from_calculation(
    payload: schemas.ReciboSimpleDesdeCalculoEntrada,
    tenant_id: str = Depends(get_tenant_id),
):
    try:
        result = calculate_alumbrado_costs(payload=payload.calculo, tenant_id=tenant_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    components = schemas.ReciboComponentesEntrada(
        csee=result.csee,
        cinv=result.cinv,
        caom=result.caom,
        cotr=result.cotr,
    )
    return build_simple_receipt(
        tenant_id=tenant_id,
        municipio=result.municipio,
        periodo=result.periodo,
        metodologia=result.metodologia,
        metadata=payload.metadata,
        componentes=components,
    )

