import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg py-2"
          : "bg-white bg-opacity-95 py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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
            <span className="text-indigo-600 font-bold text-2xl">CUNSERVICIOS</span>
          </div>
        </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
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

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavItem to="/" label="Inicio" />
            <NavItem to="/servicios" label="Servicios" />
            <NavItem to="/facturacion" label="Facturación" />
            <NavItem to="/pqr" label="PQR" />
            <NavItem to="/contacto" label="Contacto" />
            
            <div className="ml-4 pl-4 border-l border-gray-200">
              <a
                href="tel:+6011234567"
                className="flex items-center text-gray-600 hover:text-blue-600 font-medium"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
                <span className="hidden lg:inline">Emergencias: </span>116
              </a>
            </div>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-3">
              <MobileNavItem to="/" label="Inicio" onClick={toggleMenu} />
              <MobileNavItem to="/servicios" label="Servicios" onClick={toggleMenu} />
              <MobileNavItem to="/facturacion" label="Facturación" onClick={toggleMenu} />
              <MobileNavItem to="/pqr" label="PQR" onClick={toggleMenu} />
              <MobileNavItem to="/contacto" label="Contacto" onClick={toggleMenu} />
              
              <a
                href="tel:+6011234567"
                className="flex items-center text-gray-700 py-2 px-2 rounded-md hover:bg-gray-100"
                onClick={toggleMenu}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3 text-blue-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
                Emergencias: 116
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

// Componente NavItem para Desktop
const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      isActive
        ? "relative px-3 py-2 text-indigo-600 font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-indigo-600 after:rounded-t-md"
        : "px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-transparent hover:after:bg-indigo-200 after:rounded-t-md after:transition-colors"
    }
    end={to === "/"}
  >
    {label}
  </NavLink>
);

// Componente MobileNavItem para Mobile
const MobileNavItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      isActive
        ? "text-indigo-600 font-medium py-2 px-2 bg-indigo-50 rounded-md"
        : "text-gray-700 hover:text-indigo-600 py-2 px-2 hover:bg-gray-100 rounded-md"
    }
    onClick={onClick}
    end={to === "/"}
  >
    {label}
  </NavLink>
);

export default Header;