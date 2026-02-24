import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePortalSession } from "../../context/PortalSessionContext";
import { getActiveTenantId } from "../../services/api";
import { isValidTenantId, TENANT_VALIDATION_HINT } from "../../utils/tenant";

const parseLoginError = (loginError) => {
  const detail = loginError?.response?.data?.detail;
  const statusCode = loginError?.response?.status;
  if (typeof detail === "string") {
    if (statusCode === 429) {
      return `${detail} Si es un entorno local de prueba, reinicia el backend para limpiar bloqueos.`;
    }
    return detail;
  }
  if (statusCode === 500) {
    return "No fue posible validar la sesion del usuario. Verifica el seed local y reinicia backend.";
  }
  return "No fue posible iniciar sesion. Verifica tenant, correo y contraseña.";
};

const PortalLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authNotice, clearAuthNotice, isAuthenticated, login } = usePortalSession();
  const [formData, setFormData] = useState({
    entidad: "",
    tenantId: getActiveTenantId(),
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLocalEnvironment = useMemo(() => {
    if (typeof window === "undefined") return false;
    return ["localhost", "127.0.0.1"].includes(window.location.hostname);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/portal", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateLoginForm = () => {
    if (!isValidTenantId(formData.tenantId)) {
      return `Tenant invalido. ${TENANT_VALIDATION_HINT}`;
    }
    if (!formData.email.trim()) {
      return "Debes ingresar un correo de usuario.";
    }
    if (!formData.password) {
      return "Debes ingresar tu contraseña.";
    }
    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    clearAuthNotice();
    setError("");
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateLoginForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login({
        displayName: formData.entidad,
        tenantId: formData.tenantId.trim().toLowerCase(),
        email: formData.email,
        password: formData.password,
      });
      navigate(location.state?.from || "/portal", { replace: true });
    } catch (loginError) {
      setError(parseLoginError(loginError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-shell">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-12">
        <section className="space-y-4">
          <div className="portal-header-card">
            <p className="text-xs uppercase tracking-wide text-indigo-100">CUNSERVICIOS · Portal cliente</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Acceso seguro para alcaldias y equipos operativos
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-teal-50">
              Diseñado para que el equipo pueda trabajar con claridad: organizar insumos, revisar
              estado y emitir recibos de forma sencilla.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoCard
              title="Experiencia guiada"
              description="Las secciones del portal priorizan tareas esenciales, evitando sobrecarga de informacion."
            />
            <InfoCard
              title="Trazabilidad local"
              description="Cada tenant conserva historicos de recibos e insumos para pruebas y validaciones."
            />
          </div>

          {isLocalEnvironment && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-semibold">Entorno local detectado</p>
              <p className="mt-1">
                Si usas datos semilla, revisa que el correo de portal termine en{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5">cunservicios-demo.com</code>.
              </p>
            </div>
          )}
        </section>

        <form onSubmit={handleSubmit} className="card border-slate-200 shadow-md">
          <h2 className="text-2xl font-semibold text-slate-900">Acceso al portal</h2>
          <p className="mt-1 text-sm text-slate-600">
            Ingresa con credenciales institucionales para continuar.
          </p>

          {authNotice && (
            <div className="alert alert-warning mt-4">
              <p>{authNotice}</p>
            </div>
          )}
          {error && (
            <div className="alert alert-error mt-4">
              <p>{error}</p>
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div className="form-group">
              <label className="form-label" htmlFor="entidad">
                Entidad (opcional)
              </label>
              <input
                id="entidad"
                name="entidad"
                className="form-input"
                placeholder="Ej: Alcaldia Demo"
                value={formData.entidad}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tenantId">
                Identificador (tenant)
              </label>
              <input
                id="tenantId"
                name="tenantId"
                className="form-input"
                placeholder="ej: alcaldia-demo"
                value={formData.tenantId}
                onChange={handleChange}
                required
              />
              <p className="form-hint">{TENANT_VALIDATION_HINT}</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Correo de usuario
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="usuario@entidad.gov.co"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                />
                Mostrar contraseña
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4 w-full sm:w-auto" disabled={loading}>
            {loading ? "Validando..." : "Ingresar al portal"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InfoCard = ({ title, description }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-200">
    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    <p className="mt-1 text-sm text-slate-600">{description}</p>
  </div>
);

export default PortalLogin;
