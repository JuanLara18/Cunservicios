from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator


class AforoClaseEntrada(BaseModel):
    clase_iluminacion: int = Field(..., ge=1, le=3)
    carga_kw: float = Field(..., gt=0)
    horas_diarias: float = Field(..., gt=0)
    dias_facturacion: float = Field(..., gt=0)


class EnergiaNivelEntrada(BaseModel):
    nivel_tension: int = Field(..., ge=1, le=2)
    tee: float = Field(..., ge=0)
    cee_medido_kwh: float = Field(default=0, ge=0)
    aforos: list[AforoClaseEntrada] = Field(default_factory=list)


class UcapEntrada(BaseModel):
    cr_i: float = Field(default=0, ge=0)
    cr_l_base: float = Field(default=0, ge=0)
    eficacia_lm_w: Optional[float] = Field(default=None, gt=0)
    vida_util_anios: int = Field(..., gt=0)

    @model_validator(mode="after")
    def validate_luminous_efficacy(self) -> "UcapEntrada":
        if self.cr_l_base > 0 and self.eficacia_lm_w is None:
            raise ValueError(
                "eficacia_lm_w es obligatoria cuando cr_l_base es mayor a cero"
            )
        return self


class TerrenoEntrada(BaseModel):
    area_m2: float = Field(..., gt=0)
    valor_catastral_m2: float = Field(..., ge=0)


class InversionNivelEntrada(BaseModel):
    nivel_tension: int = Field(..., ge=1, le=2)
    ucap: list[UcapEntrada] = Field(default_factory=list)
    terrenos: list[TerrenoEntrada] = Field(default_factory=list)
    porcentaje_terreno: float = Field(default=0.069, ge=0)


class EventoDisponibilidadEntrada(BaseModel):
    potencia_kw: float = Field(..., ge=0)
    horas_sin_servicio: float = Field(..., ge=0)


class DisponibilidadEntrada(BaseModel):
    potencia_total_kw: float = Field(..., gt=0)
    horas_periodo: float = Field(..., gt=0)
    eventos: list[EventoDisponibilidadEntrada] = Field(default_factory=list)


class EventoVceeiEntrada(BaseModel):
    potencia_kw: float = Field(..., ge=0)
    horas_indisponibilidad: float = Field(..., ge=0)


class AOMNivelEntrada(BaseModel):
    nivel_tension: int = Field(..., ge=1, le=2)
    cra_n: float = Field(..., ge=0)
    cral_n: float = Field(..., ge=0)
    vceei_eventos: list[EventoVceeiEntrada] = Field(default_factory=list)


class COTREntrada(BaseModel):
    interventoria: float = Field(default=0, ge=0)
    costos_ambientales: float = Field(default=0, ge=0)
    polizas: float = Field(default=0, ge=0)
    tramites_impuestos: float = Field(default=0, ge=0)
    otros: float = Field(default=0, ge=0)


class ActualizacionIPPEntrada(BaseModel):
    ipp_base: float = Field(..., gt=0)
    ipp_mes_anterior: float = Field(..., gt=0)


class AlumbradoCalculoEntrada(BaseModel):
    municipio: str = Field(..., min_length=2)
    periodo: str = Field(..., min_length=3)
    anno_aplicacion: int = Field(..., ge=2022)
    tasa_retorno: float = Field(..., gt=0)
    ne_fraccion: float = Field(default=0.041, ge=0)
    faom_n: float = Field(default=0.04, ge=0)
    ambiente_marino: bool = False
    energia_niveles: list[EnergiaNivelEntrada]
    inversion_niveles: list[InversionNivelEntrada]
    disponibilidad: DisponibilidadEntrada
    aom_niveles: list[AOMNivelEntrada]
    cotr: COTREntrada = Field(default_factory=COTREntrada)
    actualizacion_ipp: Optional[ActualizacionIPPEntrada] = None
    usar_formulacion_mixta_cee: bool = True

    @model_validator(mode="after")
    def validate_non_empty_sections(self) -> "AlumbradoCalculoEntrada":
        if not self.energia_niveles:
            raise ValueError("energia_niveles no puede estar vacío")
        if not self.inversion_niveles:
            raise ValueError("inversion_niveles no puede estar vacío")
        if not self.aom_niveles:
            raise ValueError("aom_niveles no puede estar vacío")
        return self


class EnergiaNivelResultado(BaseModel):
    nivel_tension: int
    tee: float
    cee_medido_kwh: float
    cee_aforado_kwh: float
    cee_total_kwh: float
    csee_n: float


class InversionNivelResultado(BaseModel):
    nivel_tension: int
    caae_n: float
    cat_n: float
    caane_n: float
    caa_n: float
    cinv_n: float


class AOMNivelResultado(BaseModel):
    nivel_tension: int
    vceei_n: float
    crta_n: float
    caom_n: float


class ReciboLinea(BaseModel):
    concepto: str
    valor: float


class ReciboResultado(BaseModel):
    numero_recibo: str
    municipio: str
    periodo: str
    metodologia: str
    lineas: list[ReciboLinea]
    total: float


class ActualizacionIPPResultado(BaseModel):
    factor_ipp: float
    cinv_actualizado: float
    caom_actualizado: float
    cap_actualizado: float


class AlumbradoCalculoResultado(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tenant_id: str
    metodologia: str
    municipio: str
    periodo: str
    anno_aplicacion: int
    id_disponibilidad: float
    faoml: float
    faoms: float
    csee: float
    cinv: float
    caom: float
    cotr: float
    cap: float
    energia_niveles: list[EnergiaNivelResultado]
    inversion_niveles: list[InversionNivelResultado]
    aom_niveles: list[AOMNivelResultado]
    recibo: ReciboResultado
    actualizacion_ipp: Optional[ActualizacionIPPResultado] = None
    alertas: list[str] = Field(default_factory=list)

