const PQR_TYPE_MAP = {
  PETICION: "Petición",
  QUEJA: "Queja",
  RECLAMO: "Reclamo",
  SUGERENCIA: "Sugerencia",
  DENUNCIA: "Denuncia",
};

export const mapFacturaFromApi = (facturaApi) => ({
  id: facturaApi.id,
  tenantId: facturaApi.tenant_id,
  numeroFactura: facturaApi.numero_factura,
  fechaEmision: facturaApi.fecha_emision,
  fechaVencimiento: facturaApi.fecha_vencimiento,
  valorTotal: facturaApi.valor_total,
  estado: facturaApi.estado,
  clienteId: facturaApi.cliente_id,
  observaciones: facturaApi.observaciones || "",
  conceptos: (facturaApi.conceptos || []).map((concepto) => ({
    id: concepto.id,
    concepto: concepto.concepto,
    valor: concepto.valor,
  })),
});

export const getLatestFactura = (facturas) => {
  if (!Array.isArray(facturas) || facturas.length === 0) {
    return null;
  }

  return [...facturas].sort((a, b) => {
    const fechaA = new Date(a.fecha_emision).getTime();
    const fechaB = new Date(b.fecha_emision).getTime();
    return fechaB - fechaA;
  })[0];
};

export const mapPqrTypeToApi = (typeValue) => PQR_TYPE_MAP[typeValue] || typeValue;

