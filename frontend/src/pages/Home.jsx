import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-800 to-teal-600 py-16 text-white md:py-24">
        {/* Formas decorativas en el fondo */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500 rounded-full opacity-20"></div>
        <div className="absolute bottom-12 -left-16 w-64 h-64 bg-teal-400 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full opacity-10"></div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="mb-5 text-3xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Gestión clara para servicios públicos
            </h1>
            <p className="mb-8 text-base text-teal-100 md:text-xl">
              Operación institucional con enfoque en continuidad del servicio, atención al usuario y
              trazabilidad digital.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/portal/login"
                className="btn-hero btn-mobile-full bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Ingresar al portal
              </Link>
              <Link
                to="/servicios"
                className="btn-hero btn-mobile-full bg-teal-600 hover:bg-teal-700 border border-teal-400 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Ver servicios
              </Link>
              <Link
                to="/contacto"
                className="btn-hero btn-mobile-full border border-white/40 bg-transparent hover:bg-white/10"
              >
                Canales de atención
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Características principales */}
      <section className="-mt-8 py-14">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeaturedCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Respuesta inmediata"
              description="Atendemos emergencias relacionadas con acueducto y alcantarillado en el menor tiempo posible."
              color="indigo"
            />
            <FeaturedCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Calidad garantizada"
              description="Agua potable que cumple con todos los estándares de calidad nacionales e internacionales."
              color="teal"
            />
            <FeaturedCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Comodidad"
              description="Gestiona todos tus trámites y pagos desde la comodidad de tu hogar a través de nuestra plataforma."
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Servicios principales */}
      <section className="bg-gray-50 py-14">
        <div className="container">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl after:content-[''] after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-indigo-600 after:to-teal-500 after:mx-auto after:mt-4">
            Nuestros servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Acueducto"
              description="Suministro de agua potable con los más altos estándares de calidad para todos los usuarios."
              linkTo="/servicios"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
              color="indigo"
            />
            <ServiceCard
              title="Alcantarillado"
              description="Servicio de recolección y tratamiento de aguas residuales con responsabilidad ambiental."
              linkTo="/servicios"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              color="teal"
            />
            <ServiceCard
              title="Trámites en línea"
              description="Realiza tus trámites de forma rápida y segura desde nuestra plataforma digital."
              linkTo="/servicios"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Información importante y noticias */}
      <section className="py-14">
        <div className="container">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl after:content-[''] after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-indigo-600 after:to-teal-500 after:mx-auto after:mt-4">
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
              color="indigo"
            />
            <InfoCard
              title="Campañas ambientales"
              content="Participa en nuestras campañas de ahorro de agua y cuidado del medio ambiente."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="teal"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-teal-600 py-14 text-white">
        {/* Decorativos */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white to-transparent opacity-20"></div>
        <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-white rounded-full opacity-10"></div>
        
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">¿Necesitas ayuda?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-base md:text-xl">
            Nuestro equipo de atención al cliente está disponible para resolver todas tus dudas y solicitudes.
          </p>
          <Link
            to="/contacto"
            className="btn-hero bg-white text-indigo-700 hover:bg-indigo-50"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  );
};

const FEATURED_COLOR_STYLES = {
  indigo: {
    border: "hover:border-indigo-200",
    icon: "text-indigo-600",
  },
  teal: {
    border: "hover:border-teal-200",
    icon: "text-teal-600",
  },
};

const SERVICE_COLOR_STYLES = {
  indigo: {
    bar: "from-indigo-500 to-indigo-700",
    iconBox: "bg-indigo-50 text-indigo-600",
    link: "text-indigo-600 hover:text-indigo-800",
  },
  teal: {
    bar: "from-teal-500 to-teal-700",
    iconBox: "bg-teal-50 text-teal-600",
    link: "text-teal-600 hover:text-teal-800",
  },
};

const INFO_COLOR_STYLES = {
  indigo: "text-indigo-600 bg-indigo-50",
  teal: "text-teal-600 bg-teal-50",
};

// Componente de tarjeta de característica
const FeaturedCard = ({ icon, title, description, color = "indigo" }) => {
  const styles = FEATURED_COLOR_STYLES[color] || FEATURED_COLOR_STYLES.indigo;
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 transform transition-transform hover:-translate-y-1 border border-gray-100 ${styles.border}`}
    >
      <div className={`${styles.icon} mb-4`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Componente de tarjeta de servicio
const ServiceCard = ({ title, description, linkTo, icon, color = "indigo" }) => {
  const styles = SERVICE_COLOR_STYLES[color] || SERVICE_COLOR_STYLES.indigo;
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      <div className={`h-2 bg-gradient-to-r ${styles.bar}`}></div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className={`mr-3 p-2 rounded-full ${styles.iconBox}`}>{icon}</div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link to={linkTo} className={`${styles.link} font-medium flex items-center`}>
          Conocer más
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

// Componente de tarjeta de información
const InfoCard = ({ icon, title, content, color = "indigo" }) => {
  const styles = INFO_COLOR_STYLES[color] || INFO_COLOR_STYLES.indigo;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl">
      <div className={`${styles} mr-4 flex-shrink-0 p-2 rounded-full`}>{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
};

export default Home;