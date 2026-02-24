import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { usePortalSession } from "../../context/PortalSessionContext";

const PortalLayout = () => {
  const { session, logout } = usePortalSession();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Portal cliente</p>
              <h1 className="text-xl font-semibold">Espacio de gestión para alcaldías</h1>
              <p className="text-sm text-slate-600">
                Tenant activo: <span className="font-medium">{session?.tenantId}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="btn btn-outline">
                Sitio público
              </Link>
              <button onClick={logout} className="btn btn-secondary">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <nav className="space-y-1">
              <PortalNavItem to="/portal" label="Resumen" end />
              <PortalNavItem to="/portal/recibos" label="Recibos" />
              <PortalNavItem to="/portal/datos" label="Datos de entrada" />
              <PortalNavItem to="/portal/configuracion" label="Configuración" />
            </nav>
          </aside>
          <section className="space-y-4">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

const PortalNavItem = ({ to, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      isActive
        ? "block rounded-md bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700"
        : "block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
    }
  >
    {label}
  </NavLink>
);

export default PortalLayout;

