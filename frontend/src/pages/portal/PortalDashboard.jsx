import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePortalSession } from "../../context/PortalSessionContext";

const PortalDashboard = () => {
  const { session } = usePortalSession();

  const recentStats = useMemo(() => {
    const key = `portal.receipts.v1:${session?.tenantId || "public"}`;
    let receipts = [];
    try {
      const raw = localStorage.getItem(key);
      receipts = raw ? JSON.parse(raw) : [];
    } catch (error) {
      receipts = [];
    }
    return {
      totalRecibos: receipts.length,
      ultimoPeriodo: receipts[0]?.periodo || "Sin registros",
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

