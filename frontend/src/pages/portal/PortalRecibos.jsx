import React, { useMemo, useState } from "react";
import { usePortalSession } from "../../context/PortalSessionContext";
import { alumbradoPortalService } from "../../services/api";

const HISTORY_LIMIT = 40;

const safeReadJson = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const parseApiError = (requestError) => {
  const detail = requestError?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) return "Datos invalidos. Revisa los campos.";
  return "Ocurrio un error en la generacion del recibo.";
};

const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`;

const downloadFile = (filename, content, mimeType = "text/plain;charset=utf-8") => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

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
  const [historySearch, setHistorySearch] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [historyVersion, setHistoryVersion] = useState(0);

  const storageKey = useMemo(
    () => `portal.receipts.v1:${session?.tenantId || "public"}`,
    [session?.tenantId]
  );

  const receiptHistory = useMemo(() => safeReadJson(storageKey), [historyVersion, storageKey]);

  const filteredHistory = useMemo(() => {
    const term = historySearch.trim().toLowerCase();
    if (!term) return receiptHistory;
    return receiptHistory.filter((item) =>
      [item.numero_recibo, item.periodo, item.municipio, item.fuente_datos]
        .filter(Boolean)
        .some((part) => String(part).toLowerCase().includes(term))
    );
  }, [historySearch, receiptHistory]);

  const previewTotal = useMemo(() => {
    const values = Object.values(formData.componentes || {});
    return values.reduce((acc, value) => acc + (Number(value) || 0), 0);
  }, [formData.componentes]);

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

  const saveReceiptInHistory = (receipt) => {
    const currentHistory = safeReadJson(storageKey);
    const dedupedHistory = currentHistory.filter((item) => item.numero_recibo !== receipt.numero_recibo);
    const updatedHistory = [receipt, ...dedupedHistory].slice(0, HISTORY_LIMIT);
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    setHistoryVersion((current) => current + 1);
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
      setError(parseApiError(requestError));
    } finally {
      setLoading(false);
    }
  };

  const createReceipt = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setCopyStatus("");

    try {
      const response = await alumbradoPortalService.createSimpleReceiptFromTemplate(formData);
      const receipt = {
        ...response.data,
        generated_at: new Date().toISOString(),
      };
      setGeneratedReceipt(receipt);
      saveReceiptInHistory(receipt);
    } catch (requestError) {
      setError(parseApiError(requestError));
    } finally {
      setLoading(false);
    }
  };

  const copyReceiptContent = async (content, label) => {
    try {
      await navigator.clipboard.writeText(content || "");
      setCopyStatus(`Contenido ${label} copiado.`);
    } catch (copyError) {
      setCopyStatus("No fue posible copiar automaticamente.");
    }
  };

  const clearHistory = () => {
    const confirmed = window.confirm("¿Deseas limpiar el historial local de recibos para este tenant?");
    if (!confirmed) return;
    localStorage.removeItem(storageKey);
    setHistoryVersion((current) => current + 1);
    setGeneratedReceipt(null);
  };

  return (
    <div className="space-y-4">
      <div className="card portal-accent-surface">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Generacion de recibos</h2>
            <p className="mt-1 text-sm text-slate-600">
              Flujo guiado para construir recibos desde plantilla simple, sin sobrecargar al usuario.
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

      {copyStatus && (
        <div className="alert alert-info">
          <p>{copyStatus}</p>
        </div>
      )}

      <form className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]" onSubmit={createReceipt}>
        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <span className="portal-step-index">1</span>
            <h3 className="text-lg font-semibold">Datos base</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InputField
              label="Municipio"
              value={formData.municipio}
              onChange={(value) => updateField("municipio", value)}
              required
            />
            <InputField
              label="Periodo"
              value={formData.periodo}
              onChange={(value) => updateField("periodo", value)}
              required
            />
            <InputField
              label="Metodologia"
              value={formData.metodologia}
              onChange={(value) => updateField("metodologia", value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="portal-step-index">2</span>
            <h3 className="text-lg font-semibold">Componentes CAP</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

          <details className="rounded-xl border border-slate-200 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Metadatos avanzados (opcional)
            </summary>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                label="Direccion"
                value={formData.metadata.direccion}
                onChange={(value) => updateField("metadata.direccion", value)}
              />
              <InputField
                label="Observaciones"
                value={formData.metadata.observaciones}
                onChange={(value) => updateField("metadata.observaciones", value)}
              />
            </div>
          </details>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Generando..." : "Generar recibo simple"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="portal-step-card">
            <div className="flex items-center gap-2">
              <span className="portal-step-index">3</span>
              <h3 className="text-lg font-semibold">Vista previa</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">Total estimado con base en los componentes cargados.</p>
            <p className="mt-3 text-3xl font-semibold text-indigo-700">{formatMoney(previewTotal)}</p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p>• Revisa municipio y periodo antes de generar.</p>
              <p>• Usa metadatos avanzados solo si la entidad los requiere.</p>
            </div>
          </div>

          <div className="portal-step-card">
            <h3 className="text-lg font-semibold">Flujo recomendado</h3>
            <ol className="mt-3 space-y-2 text-sm text-slate-600">
              <li>1. Carga plantilla base.</li>
              <li>2. Ajusta componentes CAP.</li>
              <li>3. Genera y valida el recibo.</li>
              <li>4. Guarda evidencia en historial.</li>
            </ol>
          </div>
        </div>
      </form>

      {generatedReceipt && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="card">
            <h3 className="text-lg font-semibold">Recibo generado</h3>
            <p className="mt-2 text-sm text-slate-600">
              Numero: <span className="font-medium">{generatedReceipt.numero_recibo}</span>
            </p>
            <p className="text-sm text-slate-600">
              Total: <span className="font-medium">{formatMoney(generatedReceipt.total)}</span>
            </p>
            <p className="text-sm text-slate-600">
              Fecha:{" "}
              <span className="font-medium">
                {generatedReceipt.generated_at
                  ? new Date(generatedReceipt.generated_at).toLocaleString()
                  : "N/D"}
              </span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() =>
                  downloadFile(
                    `${generatedReceipt.numero_recibo || "recibo"}.txt`,
                    generatedReceipt.contenido_texto || ""
                  )
                }
              >
                Descargar TXT
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() =>
                  downloadFile(
                    `${generatedReceipt.numero_recibo || "recibo"}.md`,
                    generatedReceipt.contenido_markdown || "",
                    "text/markdown;charset=utf-8"
                  )
                }
              >
                Descargar MD
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => copyReceiptContent(generatedReceipt.contenido_texto, "texto")}
              >
                Copiar texto
              </button>
            </div>
            <textarea
              className="form-input mt-3 h-64 font-mono text-xs"
              readOnly
              value={generatedReceipt.contenido_texto}
            />
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">Vista markdown</h3>
            <button
              type="button"
              className="btn btn-sm btn-secondary mt-3"
              onClick={() => copyReceiptContent(generatedReceipt.contenido_markdown, "markdown")}
            >
              Copiar markdown
            </button>
            <textarea
              className="form-input mt-3 h-80 font-mono text-xs"
              readOnly
              value={generatedReceipt.contenido_markdown}
            />
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Historico local de recibos</h3>
            <p className="text-sm text-slate-600">Registros guardados en este navegador por tenant.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="form-input w-64"
              placeholder="Buscar por numero, periodo o fuente"
              value={historySearch}
              onChange={(event) => setHistorySearch(event.target.value)}
            />
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={clearHistory}
              disabled={receiptHistory.length === 0}
            >
              Limpiar historial
            </button>
          </div>
        </div>
        {receiptHistory.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No hay recibos guardados para este tenant.</p>
        ) : filteredHistory.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No hay resultados para el filtro actual.</p>
        ) : (
          <div className="table-responsive mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Periodo</th>
                  <th>Total</th>
                  <th>Fuente</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.numero_recibo}>
                    <td>{item.numero_recibo}</td>
                    <td>{item.periodo}</td>
                    <td>{formatMoney(item.total)}</td>
                    <td>{item.fuente_datos}</td>
                    <td>{item.generated_at ? new Date(item.generated_at).toLocaleString() : "N/D"}</td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => setGeneratedReceipt(item)}
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() =>
                            downloadFile(
                              `${item.numero_recibo || "recibo"}.txt`,
                              item.contenido_texto || ""
                            )
                          }
                        >
                          TXT
                        </button>
                      </div>
                    </td>
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
