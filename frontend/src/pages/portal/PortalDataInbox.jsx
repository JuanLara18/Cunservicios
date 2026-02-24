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

  const drafts = useMemo(() => {
    return safeReadJson(storageKey);
  }, [historyVersion, storageKey]);

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
      <div className="card">
        <h2 className="text-xl font-semibold">Datos de entrada</h2>
        <p className="mt-2 text-sm text-slate-600">
          Espacio inicial para registrar insumos recibidos de la entidad cliente, aunque todavía
          vengan en formatos heterogéneos (PDF, texto libre, hojas de cálculo).
        </p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="form-group">
            <label className="form-label">Origen</label>
            <select
              className="form-input"
              value={draft.origen}
              onChange={(event) => onChange("origen", event.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel/CSV</option>
              <option value="correo">Correo/Oficio</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Estado del insumo</label>
            <select
              className="form-input"
              value={draft.estado}
              onChange={(event) => onChange("estado", event.target.value)}
            >
              <option value="recibido">Recibido</option>
              <option value="en_revision">En revisión</option>
              <option value="normalizado">Normalizado</option>
              <option value="listo_calculo">Listo para cálculo</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Prioridad</label>
            <select
              className="form-input"
              value={draft.prioridad}
              onChange={(event) => onChange("prioridad", event.target.value)}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nombre de archivo o referencia</label>
            <input
              className="form-input"
              value={draft.nombreArchivo}
              onChange={(event) => onChange("nombreArchivo", event.target.value)}
              placeholder="ej: soporte_enero_2026.pdf"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <input
            className="form-input"
            value={draft.descripcion}
            onChange={(event) => onChange("descripcion", event.target.value)}
            placeholder="Resumen corto del contenido recibido"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contenido crudo</label>
          <textarea
            className="form-input h-40"
            value={draft.contenidoCrudo}
            onChange={(event) => onChange("contenidoCrudo", event.target.value)}
            placeholder="Pega aquí texto extraído o notas relevantes para normalización."
          />
        </div>

        <button type="button" className="btn btn-primary" onClick={saveDraft}>
          Guardar borrador local
        </button>
        {savedMessage && <p className="text-sm text-green-700">{savedMessage}</p>}
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
              <option value="en_revision">En revisión</option>
              <option value="normalizado">Normalizado</option>
              <option value="listo_calculo">Listo para cálculo</option>
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
                <p className="text-sm font-medium">
                  {item.nombreArchivo || "Sin referencia"} - {item.origen.toUpperCase()}
                </p>
                <p className="text-xs text-slate-600">{item.descripcion || "Sin descripción"}</p>
                <p className="text-xs text-slate-600">
                  Estado: <span className="font-medium">{item.estado || "recibido"}</span> | Prioridad:{" "}
                  <span className="font-medium">{item.prioridad || "media"}</span>
                </p>
                <p className="text-xs text-slate-500">{new Date(item.fecha).toLocaleString()}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => updateDraftStatus(item.id, "en_revision")}
                  >
                    En revisión
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
                    Listo para cálculo
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalDataInbox;

