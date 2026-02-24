import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePortalSession } from "../../context/PortalSessionContext";

const PortalLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = usePortalSession();
  const [formData, setFormData] = useState({
    entidad: "",
    tenantId: "",
    email: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/portal", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login({
      displayName: formData.entidad,
      tenantId: formData.tenantId,
      email: formData.email,
    });
    navigate(location.state?.from || "/portal", { replace: true });
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
                  required
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
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Correo de contacto
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="contacto@entidad.gov.co"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-4">
              Ingresar al portal
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

