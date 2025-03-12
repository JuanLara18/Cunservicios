import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 md:py-28 overflow-hidden">
        {/* Formas decorativas en el fondo */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500 rounded-full opacity-20"></div>
        <div className="absolute bottom-12 -left-16 w-64 h-64 bg-blue-400 rounded-full opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Servicios de calidad para su bienestar
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Suministro de agua potable y gestión de aguas residuales con los más altos estándares de calidad y compromiso con el medio ambiente.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/facturacion"
                className="btn-hero bg-white text-blue-700 hover:bg-blue-50"
              >
                Consultar factura
              </Link>
              <Link
                to="/pqr"
                className="btn-hero bg-blue-700 hover:bg-blue-800 border border-blue-400"
              >
                Radicar PQR
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Características principales */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeaturedCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Respuesta inmediata"
              description="Atendemos emergencias relacionadas con acueducto y alcantarillado en el menor tiempo posible."
            />
            <FeaturedCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Calidad garantizada"
              description="Agua potable que cumple con todos los estándares de calidad nacionales e internacionales."
            />
            <FeaturedCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Comodidad"
              description="Gestiona todos tus trámites y pagos desde la comodidad de tu hogar a través de nuestra plataforma."
            />
          </div>
        </div>
      </section>

      {/* Servicios principales */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 after:content-[''] after:block after:w-16 after:h-1 after:bg-blue-600 after:mx-auto after:mt-4">
            Nuestros servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Acueducto"
              description="Suministro de agua potable con los más altos estándares de calidad para todos los usuarios."
              linkTo="/servicios"
            />
            <ServiceCard
              title="Alcantarillado"
              description="Servicio de recolección y tratamiento de aguas residuales con responsabilidad ambiental."
              linkTo="/servicios"
            />
            <ServiceCard
              title="Trámites en línea"
              description="Realiza tus trámites de forma rápida y segura desde nuestra plataforma digital."
              linkTo="/servicios"
            />
          </div>
        </div>
      </section>

      {/* Información importante y noticias */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 after:content-[''] after:block after:w-16 after:h-1 after:bg-blue-600 after:mx-auto after:mt-4">
            Información importante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoCard
              title="Cortes programados"
              content="No hay cortes programados para los próximos días."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <InfoCard
              title="Campañas ambientales"
              content="Participa en nuestras campañas de ahorro de agua y cuidado del medio ambiente."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Necesitas ayuda?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nuestro equipo de atención al cliente está disponible para resolver todas tus dudas y solicitudes.
          </p>
          <Link
            to="/contacto"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors shadow-lg"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  );
};

// Componente de tarjeta de característica
const FeaturedCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform hover:-translate-y-1">
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Componente de tarjeta de servicio
const ServiceCard = ({ title, description, linkTo }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link to={linkTo} className="text-blue-600 hover:text-blue-800 font-medium">
        Conocer más →
      </Link>
    </div>
  </div>
);

// Componente de tarjeta de información
const InfoCard = ({ icon, title, content }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 flex">
    <div className="text-blue-600 mr-4 flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  </div>
);

export default Home;