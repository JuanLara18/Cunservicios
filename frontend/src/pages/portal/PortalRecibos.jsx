import React, { useMemo, useState } from "react";
import { alumbradoPortalService } from "../../services/api";
import { usePortalSession } from "../../context/PortalSessionContext";

const PortalRecibos = () => {
  const { session } = usePortalSession();
  const [formData, setFormData] = useState({
    municipio: session?.displayName || "",
    periodo: "2026-01",
    metodologia: "CREG 101 013 de 2022",
    componentes: {
      csee: 0,
      cinv: 0,
      caom: 0,
      cotr: 0,
    },
    metadata: {
      entidad_facturadora: "Cunservicios",
      nit: "",
      direccion: "",
      contacto: session?.email || "",
      fuente_datos: "plantilla_manual_v1",
      observaciones: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  const storageKey = useMemo(
    () => `portal.receipts.v1:${session?.tenantId || "public"}`,
    [session?.tenantId]
  );

  const receiptHistory = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }, [storageKey, generatedReceipt]);

  const updateField = (path, value) => {
    setFormData((current) => {
      const next = { ...current };
      if (path.startsWith("componentes.")) {
        const field = path.split(".")[1];
        next.componentes = { ...next.componentes, [field]: Number(value) || 0 };
      } else if (path.startsWith("metadata.")) {
        const field = path.split(".")[1];
        next.metadata = { ...next.metadata, [field]: value };
      } else {
        next[path] = value;
      }
      return next;
    });
  };

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await alumbradoPortalService.getReceiptTemplate();
      const template = response.data;
      setFormData((current) => ({
        ...current,
        ...template,
        municipio: current.municipio || template.municipio,
        metadata: {
          ...template.metadata,
          contacto: current.metadata.contacto || template.metadata.contacto || "",
          entidad_facturadora:
            current.metadata.entidad_facturadora || template.metadata.entidad_facturadora,
          fuente_datos: current.metadata.fuente_datos || template.metadata.fuente_datos,
        },
      }));
    } catch (requestError) {
      setError("No fue posible cargar la plantilla base.");
    } finally {
      setLoading(false);
    }
  };

  const createReceipt = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setGeneratedReceipt(null);

    try {
      const response = await alumbradoPortalService.createSimpleReceiptFromTemplate(formData);
      const receipt = response.data;
      setGeneratedReceipt(receipt);

      let parsedHistory = [];
      try {
        const currentHistory = localStorage.getItem(storageKey);
        parsedHistory = currentHistory ? JSON.parse(currentHistory) : [];
      } catch (error) {
        parsedHistory = [];
      }
      const updatedHistory = [receipt, ...parsedHistory].slice(0, 20);
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || "Error al generar recibo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Generación de recibos</h2>
            <p className="mt-1 text-sm text-slate-600">
              Flujo inicial para construir recibos desde una plantilla simple.
            </p>
          </div>
          <button type="button" className="btn btn-outline" onClick={loadTemplate} disabled={loading}>
            Cargar plantilla base
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      <form className="card space-y-4" onSubmit={createReceipt}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InputField
            label="Municipio"
            value={formData.municipio}
            onChange={(value) => updateField("municipio", value)}
            required
          />
          <InputField
            label="Período"
            value={formData.periodo}
            onChange={(value) => updateField("periodo", value)}
            required
          />
          <InputField
            label="Metodología"
            value={formData.metodologia}
            onChange={(value) => updateField("metodologia", value)}
            required
          />
        </div>

        <h3 className="text-lg font-semibold">Componentes CAP</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <NumberField
            label="CSEE"
            value={formData.componentes.csee}
            onChange={(value) => updateField("componentes.csee", value)}
          />
          <NumberField
            label="CINV"
            value={formData.componentes.cinv}
            onChange={(value) => updateField("componentes.cinv", value)}
          />
          <NumberField
            label="CAOM"
            value={formData.componentes.caom}
            onChange={(value) => updateField("componentes.caom", value)}
          />
          <NumberField
            label="COTR"
            value={formData.componentes.cotr}
            onChange={(value) => updateField("componentes.cotr", value)}
          />
        </div>

        <h3 className="text-lg font-semibold">Metadatos</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Entidad facturadora"
            value={formData.metadata.entidad_facturadora}
            onChange={(value) => updateField("metadata.entidad_facturadora", value)}
          />
          <InputField
            label="Fuente de datos"
            value={formData.metadata.fuente_datos}
            onChange={(value) => updateField("metadata.fuente_datos", value)}
          />
          <InputField
            label="NIT"
            value={formData.metadata.nit}
            onChange={(value) => updateField("metadata.nit", value)}
          />
          <InputField
            label="Contacto"
            value={formData.metadata.contacto}
            onChange={(value) => updateField("metadata.contacto", value)}
          />
          <InputField
            label="Dirección"
            value={formData.metadata.direccion}
            onChange={(value) => updateField("metadata.direccion", value)}
          />
          <InputField
            label="Observaciones"
            value={formData.metadata.observaciones}
            onChange={(value) => updateField("metadata.observaciones", value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Generando..." : "Generar recibo simple"}
        </button>
      </form>

      {generatedReceipt && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="card">
            <h3 className="text-lg font-semibold">Recibo generado</h3>
            <p className="mt-2 text-sm text-slate-600">
              Número: <span className="font-medium">{generatedReceipt.numero_recibo}</span>
            </p>
            <p className="text-sm text-slate-600">
              Total: <span className="font-medium">${generatedReceipt.total.toLocaleString()}</span>
            </p>
            <textarea
              className="form-input mt-3 h-64 font-mono text-xs"
              readOnly
              value={generatedReceipt.contenido_texto}
            />
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">Vista markdown</h3>
            <textarea
              className="form-input mt-3 h-80 font-mono text-xs"
              readOnly
              value={generatedReceipt.contenido_markdown}
            />
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-semibold">Histórico local de recibos</h3>
        {receiptHistory.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No hay recibos guardados para este tenant.</p>
        ) : (
          <div className="table-responsive mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Período</th>
                  <th>Total</th>
                  <th>Fuente</th>
                </tr>
              </thead>
              <tbody>
                {receiptHistory.map((item) => (
                  <tr key={item.numero_recibo}>
                    <td>{item.numero_recibo}</td>
                    <td>{item.periodo}</td>
                    <td>${Number(item.total).toLocaleString()}</td>
                    <td>{item.fuente_datos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, required = false }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      className="form-input"
      value={value || ""}
      required={required}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

const NumberField = ({ label, value, onChange }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      type="number"
      step="0.01"
      className="form-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      min="0"
    />
  </div>
);

export default PortalRecibos;

