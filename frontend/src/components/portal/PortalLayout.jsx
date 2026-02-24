import React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { FiFileText, FiGrid, FiHome, FiInbox, FiLogOut, FiSettings } from "react-icons/fi";
import { usePortalSession } from "../../context/PortalSessionContext";

const NAV_ITEMS = [
  {
    to: "/portal",
    label: "Resumen",
    description: "Estado general",
    icon: FiGrid,
    end: true,
  },
  {
    to: "/portal/recibos",
    label: "Recibos",
    description: "Generar y consultar",
    icon: FiFileText,
  },
  {
    to: "/portal/datos",
    label: "Datos",
    description: "Insumos y seguimiento",
    icon: FiInbox,
  },
  {
    to: "/portal/configuracion",
    label: "Configuración",
    description: "Perfil y seguridad",
    icon: FiSettings,
  },
];

const PortalLayout = () => {
  const { session, logout } = usePortalSession();
  const location = useLocation();

  const currentSection = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  return (
    <div className="portal-shell">
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-6 lg:px-8">
        <div className="portal-header-card mb-4">
          <div className="pointer-events-none absolute -right-20 -top-16 h-44 w-44 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-teal-300/20" />
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-indigo-100">CUNSERVICIOS · Portal cliente</p>
              <h1 className="mt-1 text-2xl font-semibold md:text-3xl">
                Portal de gestión institucional
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-teal-50">
                Un solo espacio para seguimiento operativo y facturación clara.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white/15 px-3 py-1">
                  Tenant: <strong className="font-semibold">{session?.tenantId}</strong>
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1">
                  Usuario: <strong className="font-semibold">{session?.email}</strong>
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1">
                  Rol:{" "}
                  <strong className="font-semibold">
                    {session?.isAdmin ? "Administrador" : "Usuario portal"}
                  </strong>
                </span>
              </div>
              {session?.lastLoginAt && (
                <p className="mt-3 text-xs text-indigo-100">
                  Último acceso: {new Date(session.lastLoginAt).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/" className="btn bg-white text-indigo-800 hover:bg-indigo-50 focus:ring-white/70">
                <FiHome className="mr-2 text-base" />
                Volver al inicio
              </Link>
              <button
                onClick={logout}
                className="btn border border-teal-200/60 bg-teal-500/90 text-white hover:bg-teal-400"
              >
                <FiLogOut className="mr-2 text-base" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <span className="font-medium text-slate-900">Estás en:</span>{" "}
          {currentSection?.label || "Portal"} ·{" "}
          <span className="text-slate-500">
            {currentSection?.description || "Gestión central"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Menú principal
              </p>
              <nav className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {NAV_ITEMS.map((item) => (
                  <PortalNavItem key={item.to} {...item} />
                ))}
              </nav>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Recomendación de uso</h3>
              <ol className="mt-3 space-y-2 text-xs text-slate-600">
                <li>1. Revisa el resumen.</li>
                <li>2. Organiza insumos.</li>
                <li>3. Genera y valida recibos.</li>
              </ol>
            </div>
          </aside>

          <section className="space-y-4">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

const PortalNavItem = ({ to, label, description, icon: Icon, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      isActive
        ? "group block w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 shadow-sm transition-colors"
        : "group block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
    }
  >
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 text-base text-indigo-500" />
      <div>
        <p className="font-medium leading-tight">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
    </div>
  </NavLink>
);

export default PortalLayout;

