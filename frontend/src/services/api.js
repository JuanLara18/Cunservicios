import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const DEFAULT_TENANT_ID = process.env.REACT_APP_TENANT_ID || "public";
const TENANT_STORAGE_KEY = "portal.tenantId";

const normalizeTenantId = (tenantId) => {
  if (!tenantId || typeof tenantId !== "string") return DEFAULT_TENANT_ID;
  return tenantId.trim().toLowerCase() || DEFAULT_TENANT_ID;
};

export const getActiveTenantId = () => {
  if (typeof window === "undefined") {
    return DEFAULT_TENANT_ID;
  }

  return normalizeTenantId(localStorage.getItem(TENANT_STORAGE_KEY));
};

export const setActiveTenantId = (tenantId) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TENANT_STORAGE_KEY, normalizeTenantId(tenantId));
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["X-Tenant-ID"] = getActiveTenantId();
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios para facturas
export const facturaService = {
  getFacturas: () => apiClient.get("/api/facturas"),
  getFacturaPorNumero: (numeroFactura) => apiClient.get(`/api/facturas/${numeroFactura}`),
  pagarFactura: (numeroFactura, datosPago = {}) =>
    apiClient.patch(`/api/facturas/${numeroFactura}/pagar`, datosPago),
  getFacturasPorCuenta: (numeroCuenta) => apiClient.get(`/api/facturas/cuenta/${numeroCuenta}`),
  getFacturaPorCuenta: (numeroCuenta) => apiClient.get(`/api/facturas/cuenta/${numeroCuenta}`),
};

// Servicios para PQR
export const pqrService = {
  getPQRs: () => apiClient.get("/api/pqrs"),
  getPQRPorRadicado: (radicado) => apiClient.get(`/api/pqrs/${radicado}`),
  crearPQR: (datosPQR) => apiClient.post("/api/pqrs", datosPQR),
  actualizarEstadoPQR: (radicado, estado) => apiClient.patch(`/api/pqrs/${radicado}/estado?estado=${estado}`),
};

// Servicios para clientes
export const clienteService = {
  getClientes: () => apiClient.get("/api/clientes"),
  getClientePorCuenta: (numeroCuenta) => apiClient.get(`/api/clientes/${numeroCuenta}`),
  crearCliente: (datosCliente) => apiClient.post("/api/clientes", datosCliente),
};

// Servicios para tramites
export const tramiteService = {
  getTramites: () => apiClient.get("/api/tramites"),
  iniciarTramite: (datosTramite) => apiClient.post("/api/tramites", datosTramite),
};

// Servicios para tarifas
export const tarifaService = {
  getTarifas: () => apiClient.get("/api/tarifas"),
};

export const apiContext = {
  tenantId: getActiveTenantId(),
};

export const alumbradoPortalService = {
  getParametros: (anno) => apiClient.get(`/api/alumbrado/parametros?anno=${anno}`),
  getReceiptTemplate: () => apiClient.get("/api/alumbrado/recibo/plantilla"),
  createSimpleReceiptFromTemplate: (payload) =>
    apiClient.post("/api/alumbrado/recibo/simple/desde-plantilla", payload),
  createSimpleReceiptFromCalculation: (payload) =>
    apiClient.post("/api/alumbrado/recibo/simple/desde-calculo", payload),
};

export default apiClient;