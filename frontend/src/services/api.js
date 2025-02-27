import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios para facturas
export const facturaService = {
  getFacturas: () => apiClient.get("/api/facturas"),
  getFacturaPorNumero: (numeroFactura) => apiClient.get(`/api/facturas/${numeroFactura}`),
  pagarFactura: (numeroFactura, datosPago) => apiClient.post(`/api/facturas/${numeroFactura}/pagar`, datosPago),
};

// Servicios para PQR
export const pqrService = {
  getPQRs: () => apiClient.get("/api/pqrs"),
  getPQRPorRadicado: (radicado) => apiClient.get(`/api/pqrs/${radicado}`),
  crearPQR: (datosPQR) => apiClient.post("/api/pqrs", datosPQR),
};

// Servicios para clientes
export const clienteService = {
  getClientes: () => apiClient.get("/api/clientes"),
  getClientePorCuenta: (numeroCuenta) => apiClient.get(`/api/clientes/${numeroCuenta}`),
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

export default apiClient;
