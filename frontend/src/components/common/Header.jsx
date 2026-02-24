import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Inicio", end: true },
  { to: "/servicios", label: "Servicios" },
  { to: "/facturacion", label: "Facturación" },
  { to: "/pqr", label: "PQR" },
  { to: "/contacto", label: "Contacto" },
  { to: "/portal", label: "Portal clientes" },
];

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 16) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
    >
      <div
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "border-slate-200/80 bg-white/95 shadow-sm"
            : "border-transparent bg-white/90"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold leading-none text-indigo-700 md:text-lg">
                  CUNSERVICIOS
                </p>
                <p className="hidden text-xs text-slate-500 md:block">Servicios públicos y portal cliente</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.to} to={item.to} label={item.label} end={item.end} />
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <a href="tel:+6011234567" className="btn btn-outline btn-sm">
                Emergencias 116
              </a>
              <Link to="/portal" className="btn btn-primary btn-sm">
                Portal clientes
              </Link>
            </div>
            <button
              className="rounded-lg border border-slate-200 bg-white/95 p-2 text-slate-700 shadow-sm hover:bg-slate-100 md:hidden"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <button
            className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú de navegación"
          />
          <aside className="fixed right-0 top-0 z-50 h-full w-[86%] max-w-sm border-l border-slate-200 bg-white p-5 shadow-2xl md:hidden">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Menú</p>
              <button
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <MobileNavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  onClick={() => setIsMenuOpen(false)}
                  end={item.end}
                />
              ))}
            </nav>

            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
              <a href="tel:+6011234567" className="btn btn-outline btn-mobile-full">
                Emergencias 116
              </a>
              <Link to="/portal" className="btn btn-primary btn-mobile-full">
                Ingresar al portal
              </Link>
            </div>
          </aside>
        </>
      )}
    </header>
  );
};

const NavItem = ({ to, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      isActive
        ? "rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
        : "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-700"
    }
  >
    {label}
  </NavLink>
);

const MobileNavItem = ({ to, label, onClick, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      isActive
        ? "block rounded-lg bg-indigo-50 px-3 py-2 font-medium text-indigo-700"
        : "block rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
    }
    onClick={onClick}
  >
    {label}
  </NavLink>
);

export default Header;