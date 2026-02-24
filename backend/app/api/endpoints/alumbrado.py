from app.api.tenant import get_tenant_id
from app.schemas import alumbrado as schemas
from app.services.alumbrado_calculator import (
    FAOMS_MARINO,
    METODOLOGIA,
    calculate_alumbrado_costs,
    get_faoml_for_year,
)
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

