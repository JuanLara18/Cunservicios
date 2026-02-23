import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const TENANT_ID = process.env.REACT_APP_TENANT_ID || "public";

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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["X-Tenant-ID"] = TENANT_ID;
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
  tenantId: TENANT_ID,
};

export default apiClient;