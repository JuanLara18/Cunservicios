import React, { useMemo, useState } from "react";
import { usePortalSession } from "../../context/PortalSessionContext";

const PortalDataInbox = () => {
  const { session } = usePortalSession();
  const [draft, setDraft] = useState({
    origen: "pdf",
    nombreArchivo: "",
    descripcion: "",
    contenidoCrudo: "",
  });
  const [saved, setSaved] = useState(false);

  const storageKey = useMemo(
    () => `portal.data_inbox.v1:${session?.tenantId || "public"}`,
    [session?.tenantId]
  );

  const drafts = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }, [storageKey, saved]);

  const onChange = (field, value) => {
    setSaved(false);
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const saveDraft = () => {
    let parsed = [];
    try {
      const current = localStorage.getItem(storageKey);
      parsed = current ? JSON.parse(current) : [];
    } catch (error) {
      parsed = [];
    }
    const record = {
      ...draft,
      id: `${Date.now()}`,
      fecha: new Date().toISOString(),
    };
    const updated = [record, ...parsed].slice(0, 30);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setSaved(true);
    setDraft({
      origen: "pdf",
      nombreArchivo: "",
      descripcion: "",
      contenidoCrudo: "",
    });
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
        {saved && <p className="text-sm text-green-700">Borrador guardado correctamente.</p>}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold">Borradores recientes</h3>
        {drafts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Sin borradores registrados.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {drafts.map((item) => (
              <div key={item.id} className="rounded-md border border-slate-200 p-3">
                <p className="text-sm font-medium">
                  {item.nombreArchivo || "Sin referencia"} - {item.origen.toUpperCase()}
                </p>
                <p className="text-xs text-slate-600">{item.descripcion || "Sin descripción"}</p>
                <p className="text-xs text-slate-500">{new Date(item.fecha).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalDataInbox;

