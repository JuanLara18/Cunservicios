import React, { useState } from "react";
import { authService } from "../../services/api";
import { usePortalSession } from "../../context/PortalSessionContext";
import { isValidTenantId, TENANT_VALIDATION_HINT } from "../../utils/tenant";

const PortalSettings = () => {
  const { session, updateSession } = usePortalSession();
  const [formData, setFormData] = useState({
    displayName: session?.displayName || "",
    tenantId: session?.tenantId || "",
  });
  const [profileState, setProfileState] = useState({
    saved: false,
    error: "",
  });
  const [passwordState, setPasswordState] = useState({
    loading: false,
    saved: false,
    error: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onChange = (field, value) => {
    setProfileState({ saved: false, error: "" });
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const normalizedTenant = formData.tenantId.trim().toLowerCase();
    if (!isValidTenantId(normalizedTenant)) {
      setProfileState({
        saved: false,
        error: `Tenant invalido. ${TENANT_VALIDATION_HINT}`,
      });
      return;
    }

    updateSession({
      displayName: formData.displayName,
      tenantId: normalizedTenant,
    });
    setProfileState({ saved: true, error: "" });
  };

  const onPasswordChange = (field, value) => {
    setPasswordState((current) => ({ ...current, saved: false, error: "" }));
    setPasswordData((current) => ({ ...current, [field]: value }));
  };

  const onSubmitPassword = async (event) => {
    event.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordState({
        loading: false,
        saved: false,
        error: "Completa todos los campos de contraseña.",
      });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordState({
        loading: false,
        saved: false,
        error: "La nueva contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordState({
        loading: false,
        saved: false,
        error: "La confirmacion no coincide con la nueva contraseña.",
      });
      return;
    }

    setPasswordState({ loading: true, saved: false, error: "" });
    try {
      await authService.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      setPasswordState({
        loading: false,
        saved: true,
        error: "",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setPasswordState({
        loading: false,
        saved: false,
        error: typeof detail === "string" ? detail : "No fue posible actualizar la contraseña.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="card border-indigo-100 bg-gradient-to-br from-white to-indigo-50">
        <h2 className="text-xl font-semibold">Configuracion del portal</h2>
        <p className="mt-2 text-sm text-slate-600">
          Personaliza datos visibles del entorno y administra la seguridad de acceso.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="card space-y-4" onSubmit={onSubmit}>
          <h3 className="text-lg font-semibold">Perfil operativo</h3>
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
            <ReadOnlyField label="Correo de usuario" value={session?.email || "-"} />
            <ReadOnlyField
              label="Rol de acceso"
              value={session?.isAdmin ? "Administrador" : "Usuario portal"}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Guardar cambios
          </button>
          {profileState.error && <p className="text-sm text-red-700">{profileState.error}</p>}
          {!profileState.error && <p className="form-hint">{TENANT_VALIDATION_HINT}</p>}
          {profileState.saved && <p className="text-sm text-green-700">Configuracion actualizada.</p>}
        </form>

        <div className="space-y-4">
          <div className="portal-step-card">
            <h3 className="text-lg font-semibold">Recomendaciones de seguridad</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Cambia contraseña periodicamente.</li>
              <li>• Usa combinaciones largas con simbolos.</li>
              <li>• Evita compartir usuarios entre personas del equipo.</li>
            </ul>
          </div>
          <div className="portal-step-card">
            <h3 className="text-lg font-semibold">Estado de sesion</h3>
            <p className="mt-2 text-sm text-slate-600">
              Tenant activo: <strong>{session?.tenantId || "public"}</strong>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Ultimo acceso registrado:{" "}
              <strong>
                {session?.lastLoginAt ? new Date(session.lastLoginAt).toLocaleString() : "N/D"}
              </strong>
            </p>
          </div>
        </div>
      </div>

      <form className="card space-y-4" onSubmit={onSubmitPassword}>
        <h3 className="text-lg font-semibold">Seguridad de la cuenta</h3>
        <p className="text-sm text-slate-600">
          Cambia la contraseña del usuario autenticado para mantener acceso controlado.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PasswordField
            label="Contraseña actual"
            value={passwordData.currentPassword}
            onChange={(value) => onPasswordChange("currentPassword", value)}
          />
          <PasswordField
            label="Nueva contraseña"
            value={passwordData.newPassword}
            onChange={(value) => onPasswordChange("newPassword", value)}
          />
          <PasswordField
            label="Confirmar nueva contraseña"
            value={passwordData.confirmPassword}
            onChange={(value) => onPasswordChange("confirmPassword", value)}
          />
        </div>

        <button type="submit" className="btn btn-secondary" disabled={passwordState.loading}>
          {passwordState.loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>
        {passwordState.error && <p className="text-sm text-red-700">{passwordState.error}</p>}
        {passwordState.saved && (
          <p className="text-sm text-green-700">Contraseña actualizada correctamente.</p>
        )}
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

const ReadOnlyField = ({ label, value }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input className="form-input bg-slate-100" value={value} readOnly />
  </div>
);

const PasswordField = ({ label, value, onChange }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      type="password"
      className="form-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

export default PortalSettings;
