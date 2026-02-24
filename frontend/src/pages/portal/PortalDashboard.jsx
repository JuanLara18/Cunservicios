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

  const recentStats = useMemo(() => {
    const receiptsKey = `portal.receipts.v1:${session?.tenantId || "public"}`;
    const inboxKey = `portal.data_inbox.v1:${session?.tenantId || "public"}`;
    const receipts = safeReadJson(receiptsKey);
    const drafts = safeReadJson(inboxKey);
    const draftsReady = drafts.filter((item) => item.estado === "listo_calculo");
    return {
      totalRecibos: receipts.length,
      ultimoPeriodo: receipts[0]?.periodo || "Sin registros",
      totalBorradores: drafts.length,
      listosParaCalculo: draftsReady.length,
      recibosRecientes: receipts.slice(0, 3),
      draftsRecientes: drafts.slice(0, 3),
    };
  }, [session?.tenantId]);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold">Bienvenido, {session?.displayName}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Este tablero consolida la operación inicial del portal. Desde aquí puedes generar
          recibos, revisar históricos y preparar datos para nuevos módulos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Tenant activo" value={session?.tenantId || "public"} />
        <KpiCard title="Recibos generados" value={recentStats.totalRecibos} />
        <KpiCard title="Último período" value={recentStats.ultimoPeriodo} />
        <KpiCard title="Insumos registrados" value={recentStats.totalBorradores} />
        <KpiCard title="Insumos listos para cálculo" value={recentStats.listosParaCalculo} />
        <KpiCard
          title="Rol del usuario"
          value={session?.isAdmin ? "Administrador" : "Usuario portal"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold">Acciones rápidas</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/portal/recibos" className="btn btn-primary">
              Generar recibo
            </Link>
            <Link to="/portal/datos" className="btn btn-secondary">
              Cargar datos base
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold">Siguiente evolución</h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-slate-700">
            <li>Ingesta automática desde PDF/Excel.</li>
            <li>Histórico persistente en backend por cliente.</li>
            <li>Descarga de recibo en PDF con firma institucional.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold">Recibos recientes</h3>
          {recentStats.recibosRecientes.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">Aún no hay recibos generados.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {recentStats.recibosRecientes.map((item) => (
                <li key={item.numero_recibo} className="rounded-md border border-slate-200 p-2">
                  <p className="font-medium">{item.numero_recibo}</p>
                  <p>Período: {item.periodo}</p>
                  <p>Total: ${Number(item.total).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold">Insumos recientes</h3>
          {recentStats.draftsRecientes.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No hay insumos cargados.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {recentStats.draftsRecientes.map((item) => (
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
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
    <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
  </div>
);

export default PortalDashboard;

