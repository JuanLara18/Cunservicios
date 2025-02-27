import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mx-auto">
      <section className="bg-blue-600 text-white py-16 rounded-lg my-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a Cunservicios</h1>
          <p className="text-xl mb-8">
            Servicios de acueducto y alcantarillado para el municipio
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/facturacion" className="btn bg-white text-blue-600 hover:bg-blue-100">
              Consultar factura
            </Link>
            <Link to="/pqr" className="btn bg-blue-700 text-white hover:bg-blue-800 border border-white">
              Radicar PQR
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestros servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">Acueducto</h3>
            <p className="mb-4">
              Suministro de agua potable con los más altos estándares de calidad.
            </p>
            <Link to="/servicios" className="text-blue-600 hover:underline">
              Conocer más
            </Link>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">Alcantarillado</h3>
            <p className="mb-4">
              Servicio de recolección y tratamiento de aguas residuales.
            </p>
            <Link to="/servicios" className="text-blue-600 hover:underline">
              Conocer más
            </Link>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">Trámites en línea</h3>
            <p className="mb-4">
              Realiza tus trámites de forma rápida y segura desde nuestra plataforma.
            </p>
            <Link to="/servicios" className="text-blue-600 hover:underline">
              Conocer más
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-12 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Información importante</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Cortes programados</h3>
              <p>
                No hay cortes programados para los próximos días.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Campañas ambientales</h3>
              <p>
                Participa en nuestras campañas de ahorro de agua y cuidado del medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
