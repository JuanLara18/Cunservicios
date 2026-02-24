import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePortalSession } from "../../context/PortalSessionContext";

const safeReadJson = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const PortalDashboard = () => {
  const { session } = usePortalSession();

  const portalSummary = useMemo(() => {
    const receiptsKey = `portal.receipts.v1:${session?.tenantId || "public"}`;
    const inboxKey = `portal.data_inbox.v1:${session?.tenantId || "public"}`;
    const receipts = safeReadJson(receiptsKey);
    const drafts = safeReadJson(inboxKey);
    const draftsReady = drafts.filter((item) => item.estado === "listo_calculo");
    const draftsReview = drafts.filter((item) => item.estado === "en_revision");
    const score = Math.min(
      100,
      (receipts.length > 0 ? 45 : 0) + (draftsReady.length > 0 ? 35 : 0) + (drafts.length > 0 ? 20 : 0)
    );

    return {
      totalRecibos: receipts.length,
      ultimoPeriodo: receipts[0]?.periodo || "Sin registros",
      totalBorradores: drafts.length,
      listosParaCalculo: draftsReady.length,
      enRevision: draftsReview.length,
      recibosRecientes: receipts.slice(0, 3),
      draftsRecientes: drafts.slice(0, 3),
      readinessScore: score,
    };
  }, [session?.tenantId]);

  const readinessLabel =
    portalSummary.readinessScore >= 80
      ? "Operacion estable"
      : portalSummary.readinessScore >= 40
        ? "En consolidacion"
        : "Inicio de operacion";

  return (
    <div className="space-y-4">
      <div className="card portal-accent-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-600">Resumen operativo</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              Bienvenido, {session?.displayName || "equipo de la entidad"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Este espacio prioriza tareas esenciales para que el equipo avance sin friccion:
              organizar insumos, validar estado y generar recibos.
            </p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Madurez del portal</p>
            <p className="mt-1 text-xl font-semibold text-indigo-700">{portalSummary.readinessScore}%</p>
            <p className="text-xs text-slate-500">{readinessLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Tenant activo" value={session?.tenantId || "public"} />
        <KpiCard title="Recibos generados" value={portalSummary.totalRecibos} />
        <KpiCard title="Insumos listos para calculo" value={portalSummary.listosParaCalculo} />
        <KpiCard title="Insumos en revision" value={portalSummary.enRevision} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="portal-step-card xl:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">Ruta recomendada de trabajo</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <StepAction
              index="1"
              title="Organizar insumos"
              description="Centraliza documentos y deja prioridades claras para el equipo."
              actionLabel="Ir a datos"
              to="/portal/datos"
            />
            <StepAction
              index="2"
              title="Validar preparacion"
              description="Asegura que existan insumos listos antes de facturar."
              actionLabel="Revisar estado"
              to="/portal"
            />
            <StepAction
              index="3"
              title="Generar recibo"
              description="Completa plantilla, valida totales y publica soporte."
              actionLabel="Crear recibo"
              to="/portal/recibos"
            />
          </div>
        </div>

        <div className="portal-step-card">
          <h3 className="text-lg font-semibold text-slate-900">Estado actual</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <strong className="text-slate-900">Ultimo periodo:</strong> {portalSummary.ultimoPeriodo}
            </li>
            <li>
              <strong className="text-slate-900">Recibos:</strong> {portalSummary.totalRecibos}
            </li>
            <li>
              <strong className="text-slate-900">Insumos registrados:</strong>{" "}
              {portalSummary.totalBorradores}
            </li>
            <li>
              <strong className="text-slate-900">Rol actual:</strong>{" "}
              {session?.isAdmin ? "Administrador" : "Usuario portal"}
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="portal-step-card">
          <h3 className="text-lg font-semibold">Recibos recientes</h3>
          {portalSummary.recibosRecientes.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">
              Aun no hay recibos generados. Empieza en la seccion Recibos.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {portalSummary.recibosRecientes.map((item) => (
                <li key={item.numero_recibo} className="rounded-md border border-slate-200 p-2">
                  <p className="font-medium">{item.numero_recibo}</p>
                  <p>Periodo: {item.periodo}</p>
                  <p>Total: ${Number(item.total).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="portal-step-card">
          <h3 className="text-lg font-semibold">Insumos recientes</h3>
          {portalSummary.draftsRecientes.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No hay insumos cargados.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {portalSummary.draftsRecientes.map((item) => (
                <li key={item.id} className="rounded-md border border-slate-200 p-2">
                  <p className="font-medium">{item.nombreArchivo || "Sin referencia"}</p>
                  <p>
                    {item.origen?.toUpperCase()} - {item.estado || "recibido"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value }) => (
  <div className="portal-metric">
    <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
    <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
  </div>
);

const StepAction = ({ index, title, description, actionLabel, to }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3">
    <span className="portal-step-index">{index}</span>
    <h4 className="mt-2 text-sm font-semibold text-slate-900">{title}</h4>
    <p className="mt-1 text-xs text-slate-600">{description}</p>
    <Link to={to} className="btn btn-sm btn-outline mt-3">
      {actionLabel}
    </Link>
  </div>
);

export default PortalDashboard;
