import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Página no encontrada</h2>
      <p className="text-xl text-gray-600 mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link
        to="/"
        className="btn btn-primary inline-flex items-center space-x-2"
      >
        <span>Volver al inicio</span>
      </Link>
    </div>
  );
};

export default NotFound;
