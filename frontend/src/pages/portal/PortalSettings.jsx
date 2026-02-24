import React, { useState } from "react";
import { usePortalSession } from "../../context/PortalSessionContext";

const PortalSettings = () => {
  const { session, updateSession } = usePortalSession();
  const [formData, setFormData] = useState({
    displayName: session?.displayName || "",
    tenantId: session?.tenantId || "",
    email: session?.email || "",
  });
  const [saved, setSaved] = useState(false);

  const onChange = (field, value) => {
    setSaved(false);
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    updateSession({
      displayName: formData.displayName,
      tenantId: formData.tenantId.trim().toLowerCase(),
      email: formData.email,
    });
    setSaved(true);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold">Configuración del portal</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ajustes básicos del espacio cliente. Esta sección evolucionará para gestionar usuarios,
          permisos y branding institucional.
        </p>
      </div>

      <form className="card space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Nombre visible"
            value={formData.displayName}
            onChange={(value) => onChange("displayName", value)}
          />
          <Field
            label="Tenant ID"
            value={formData.tenantId}
            onChange={(value) => onChange("tenantId", value)}
          />
          <Field
            label="Correo de contacto"
            value={formData.email}
            onChange={(value) => onChange("email", value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
        {saved && <p className="text-sm text-green-700">Configuración actualizada.</p>}
      </form>
    </div>
  );
};

const Field = ({ label, value, onChange }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input className="form-input" value={value} onChange={(event) => onChange(event.target.value)} />
  </div>
);

export default PortalSettings;

