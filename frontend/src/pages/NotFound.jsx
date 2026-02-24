import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="page-shell">
      <div className="card text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Error de navegación</p>
        <h1 className="mt-2 text-6xl font-bold text-indigo-600">404</h1>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
          Página no encontrada
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Lo sentimos, la página que estás buscando no existe o fue movida. Puedes volver al inicio
          para continuar navegando.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn btn-primary btn-mobile-full">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
