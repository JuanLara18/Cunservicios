import React, { useMemo, useState } from "react";
import { usePortalSession } from "../../context/PortalSessionContext";

const safeReadJson = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const statusLabel = {
  recibido: "Recibido",
  en_revision: "En revision",
  normalizado: "Normalizado",
  listo_calculo: "Listo para calculo",
};

const statusBadge = {
  recibido: "portal-badge portal-badge-neutral",
  en_revision: "portal-badge portal-badge-warning",
  normalizado: "portal-badge portal-badge-success",
  listo_calculo: "portal-badge portal-badge-success",
};

const PortalDataInbox = () => {
  const { session } = usePortalSession();
  const [draft, setDraft] = useState({
    origen: "pdf",
    estado: "recibido",
    prioridad: "media",
    nombreArchivo: "",
    descripcion: "",
    contenidoCrudo: "",
  });
  const [savedMessage, setSavedMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrigin, setFilterOrigin] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [historyVersion, setHistoryVersion] = useState(0);

  const storageKey = useMemo(
    () => `portal.data_inbox.v1:${session?.tenantId || "public"}`,
    [session?.tenantId]
  );

  const drafts = useMemo(() => safeReadJson(storageKey), [historyVersion, storageKey]);

  const filteredDrafts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return drafts.filter((item) => {
      const originMatch = filterOrigin === "todos" || item.origen === filterOrigin;
      const statusMatch = filterStatus === "todos" || item.estado === filterStatus;
      if (!originMatch || !statusMatch) return false;
      if (!term) return true;

      return [item.nombreArchivo, item.descripcion, item.contenidoCrudo]
        .filter(Boolean)
        .some((part) => String(part).toLowerCase().includes(term));
    });
  }, [drafts, filterOrigin, filterStatus, searchTerm]);

  const counters = useMemo(
    () => ({
      total: drafts.length,
      recibido: drafts.filter((item) => item.estado === "recibido").length,
      revision: drafts.filter((item) => item.estado === "en_revision").length,
      listos: drafts.filter((item) => item.estado === "listo_calculo").length,
    }),
    [drafts]
  );

  const onChange = (field, value) => {
    setSavedMessage("");
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const saveDraft = () => {
    if (!draft.nombreArchivo.trim() && !draft.contenidoCrudo.trim()) {
      setSavedMessage("Agrega al menos una referencia de archivo o contenido crudo.");
      return;
    }

    const parsed = safeReadJson(storageKey);
    const record = {
      ...draft,
      id: `${Date.now()}`,
      fecha: new Date().toISOString(),
    };
    const updated = [record, ...parsed].slice(0, 30);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setHistoryVersion((current) => current + 1);
    setSavedMessage("Borrador guardado correctamente.");
    setDraft({
      origen: "pdf",
      estado: "recibido",
      prioridad: "media",
      nombreArchivo: "",
      descripcion: "",
      contenidoCrudo: "",
    });
  };

  const updateDraftStatus = (id, estado) => {
    const updated = drafts.map((item) => (item.id === id ? { ...item, estado } : item));
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setHistoryVersion((current) => current + 1);
    setSavedMessage("Estado actualizado.");
  };

  const removeDraft = (id) => {
    const confirmed = window.confirm("¿Eliminar este borrador?");
    if (!confirmed) return;

    const updated = drafts.filter((item) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setHistoryVersion((current) => current + 1);
    setSavedMessage("Borrador eliminado.");
  };

  return (
    <div className="space-y-4">
      <div className="card border-indigo-100 bg-gradient-to-br from-white to-indigo-50">
        <h2 className="text-xl font-semibold">Datos de entrada</h2>
        <p className="mt-2 text-sm text-slate-600">
          Registra insumos de manera simple y conviertelos en un flujo ordenado para calculo y
          facturacion.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CounterCard label="Total insumos" value={counters.total} />
        <CounterCard label="Recibidos" value={counters.recibido} />
        <CounterCard label="En revision" value={counters.revision} />
        <CounterCard label="Listos para calculo" value={counters.listos} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <span className="portal-step-index">1</span>
            <h3 className="text-lg font-semibold">Registrar nuevo insumo</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Origen"
              value={draft.origen}
              onChange={(value) => onChange("origen", value)}
              options={[
                { value: "pdf", label: "PDF" },
                { value: "excel", label: "Excel/CSV" },
                { value: "correo", label: "Correo/Oficio" },
                { value: "manual", label: "Manual" },
              ]}
            />
            <SelectField
              label="Estado del insumo"
              value={draft.estado}
              onChange={(value) => onChange("estado", value)}
              options={[
                { value: "recibido", label: "Recibido" },
                { value: "en_revision", label: "En revision" },
                { value: "normalizado", label: "Normalizado" },
                { value: "listo_calculo", label: "Listo para calculo" },
              ]}
            />
            <SelectField
              label="Prioridad"
              value={draft.prioridad}
              onChange={(value) => onChange("prioridad", value)}
              options={[
                { value: "baja", label: "Baja" },
                { value: "media", label: "Media" },
                { value: "alta", label: "Alta" },
              ]}
            />
            <InputField
              label="Nombre de archivo o referencia"
              value={draft.nombreArchivo}
              onChange={(value) => onChange("nombreArchivo", value)}
              placeholder="ej: soporte_enero_2026.pdf"
            />
          </div>

          <InputField
            label="Descripcion"
            value={draft.descripcion}
            onChange={(value) => onChange("descripcion", value)}
            placeholder="Resumen corto del contenido recibido"
          />

          <div className="form-group">
            <label className="form-label">Contenido crudo</label>
            <textarea
              className="form-input h-40"
              value={draft.contenidoCrudo}
              onChange={(event) => onChange("contenidoCrudo", event.target.value)}
              placeholder="Pega aqui texto extraido o notas relevantes para normalizacion."
            />
          </div>

          <button type="button" className="btn btn-primary" onClick={saveDraft}>
            Guardar borrador local
          </button>
          {savedMessage && <p className="text-sm text-green-700">{savedMessage}</p>}
        </div>

        <div className="space-y-4">
          <div className="portal-step-card">
            <h3 className="text-lg font-semibold">Guia rapida</h3>
            <ol className="mt-3 space-y-2 text-sm text-slate-600">
              <li>1. Carga evidencia y clasifica origen.</li>
              <li>2. Marca estado segun avance de analisis.</li>
              <li>3. Prioriza y pasa a "Listo para calculo".</li>
              <li>4. Continua en modulo de Recibos.</li>
            </ol>
          </div>
          <div className="portal-step-card">
            <h3 className="text-lg font-semibold">Buenas practicas</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Usa nombres de archivo consistentes por periodo.</li>
              <li>• Evita textos extensos en descripcion; usa contenido crudo para detalle.</li>
              <li>• Actualiza estado al finalizar cada revision.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold">Borradores recientes</h3>
          <div className="flex flex-wrap gap-2">
            <input
              className="form-input w-56"
              placeholder="Buscar borradores"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              className="form-input w-40"
              value={filterOrigin}
              onChange={(event) => setFilterOrigin(event.target.value)}
            >
              <option value="todos">Origen: todos</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel/CSV</option>
              <option value="correo">Correo/Oficio</option>
              <option value="manual">Manual</option>
            </select>
            <select
              className="form-input w-48"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              <option value="todos">Estado: todos</option>
              <option value="recibido">Recibido</option>
              <option value="en_revision">En revision</option>
              <option value="normalizado">Normalizado</option>
              <option value="listo_calculo">Listo para calculo</option>
            </select>
          </div>
        </div>

        {drafts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Sin borradores registrados.</p>
        ) : filteredDrafts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No hay resultados para el filtro actual.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {filteredDrafts.map((item) => (
              <div key={item.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.nombreArchivo || "Sin referencia"} - {item.origen.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-600">{item.descripcion || "Sin descripcion"}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={statusBadge[item.estado] || "portal-badge portal-badge-neutral"}>
                        {statusLabel[item.estado] || "Recibido"}
                      </span>
                      <span className="portal-badge portal-badge-neutral">
                        Prioridad: {item.prioridad || "media"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{new Date(item.fecha).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => updateDraftStatus(item.id, "en_revision")}
                    >
                      En revision
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => updateDraftStatus(item.id, "normalizado")}
                    >
                      Normalizado
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => updateDraftStatus(item.id, "listo_calculo")}
                    >
                      Listo para calculo
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeDraft(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CounterCard = ({ label, value }) => (
  <div className="portal-metric">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
  </div>
);

const InputField = ({ label, value, onChange, placeholder = "" }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      className="form-input"
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <select className="form-input" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default PortalDataInbox;
