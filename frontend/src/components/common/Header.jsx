import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <span className="text-blue-600 font-bold text-2xl">CUNSERVICIOS</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={toggleMenu}
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
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 hover:text-blue-600"
              }
              end
            >
              Inicio
            </NavLink>
            <NavLink
              to="/servicios"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Servicios
            </NavLink>
            <NavLink
              to="/facturacion"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Facturación
            </NavLink>
            <NavLink
              to="/pqr"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              PQR
            </NavLink>
            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Contacto
            </NavLink>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-medium py-2"
                    : "text-gray-700 hover:text-blue-600 py-2"
                }
                onClick={toggleMenu}
                end
              >
                Inicio
              </NavLink>
              <NavLink
                to="/servicios"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-medium py-2"
                    : "text-gray-700 hover:text-blue-600 py-2"
                }
                onClick={toggleMenu}
              >
                Servicios
              </NavLink>
              <NavLink
                to="/facturacion"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-medium py-2"
                    : "text-gray-700 hover:text-blue-600 py-2"
                }
                onClick={toggleMenu}
              >
                Facturación
              </NavLink>
              <NavLink
                to="/pqr"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-medium py-2"
                    : "text-gray-700 hover:text-blue-600 py-2"
                }
                onClick={toggleMenu}
              >
                PQR
              </NavLink>
              <NavLink
                to="/contacto"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-medium py-2"
                    : "text-gray-700 hover:text-blue-600 py-2"
                }
                onClick={toggleMenu}
              >
                Contacto
              </NavLink>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
