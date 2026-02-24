import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePortalSession } from "../../context/PortalSessionContext";
import { isValidTenantId, TENANT_VALIDATION_HINT } from "../../utils/tenant";

const PortalLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authNotice, clearAuthNotice, isAuthenticated, login } = usePortalSession();
  const [formData, setFormData] = useState({
    entidad: "",
    tenantId: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/portal", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateLoginForm = () => {
    if (!isValidTenantId(formData.tenantId)) {
      return `Tenant inválido. ${TENANT_VALIDATION_HINT}`;
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
      const detail = loginError?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "No fue posible iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 md:px-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Ingreso al portal de cliente</h1>
          <p className="mt-2 text-sm text-slate-600">
            Estructura inicial para alcaldías y entidades territoriales.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="card">
            <h2 className="mb-4 text-xl font-semibold">Acceso inicial</h2>
            {authNotice && (
              <div className="alert alert-warning">
                <p>{authNotice}</p>
              </div>
            )}
            {error && (
              <div className="alert alert-error">
                <p>{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label" htmlFor="entidad">
                  Entidad
                </label>
                <input
                  id="entidad"
                  name="entidad"
                  className="form-input"
                  placeholder="Alcaldía de ..."
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
                  placeholder="ej: alcaldia-chia"
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
                  placeholder="contacto@entidad.gov.co"
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
            <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
              {loading ? "Validando..." : "Ingresar al portal"}
            </button>
          </form>

          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Capacidades iniciales</h2>
            <ul className="list-disc space-y-2 pl-6 text-sm text-slate-700">
              <li>Resumen operativo del tenant.</li>
              <li>Generación de recibos desde plantilla simple.</li>
              <li>Espacio para consolidar datos de entrada.</li>
              <li>Estructura escalable para módulos futuros.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;

