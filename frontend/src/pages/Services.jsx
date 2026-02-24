import React from "react";

const Services = () => {
  return (
    <div className="page-shell space-y-6">
      <section className="page-hero">
        <h1 className="page-title">Nuestros servicios</h1>
        <p className="page-subtitle">
          Operamos con enfoque técnico, continuidad y atención al usuario. Aquí encuentras una
          vista clara de nuestras capacidades principales.
        </p>
      </section>

      <section className="card">
        <h2 className="page-section-title">Acueducto</h2>
        <p className="mt-2 text-slate-600">
          Garantizamos suministro de agua potable bajo estándares de calidad y control sanitario.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="surface-soft">
            <h3 className="mb-2 text-lg font-semibold">Captación y tratamiento</h3>
            <p className="text-sm text-slate-600">
              Nuestras plantas usan procesos técnicos para mantener niveles de potabilidad y
              seguridad del recurso hídrico.
            </p>
          </div>
          <div className="surface-soft">
            <h3 className="mb-2 text-lg font-semibold">Distribución</h3>
            <p className="text-sm text-slate-600">
              Red de distribución en mejora continua para asegurar cobertura, presión adecuada y
              respuesta operativa.
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="page-section-title">Alcantarillado</h2>
        <p className="mt-2 text-slate-600">
          Gestionamos recolección, transporte y tratamiento de aguas residuales con enfoque en
          salud pública y protección ambiental.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="surface-soft">
            <h3 className="mb-2 text-lg font-semibold">Red de recolección</h3>
            <p className="text-sm text-slate-600">
              Infraestructura operativa para conducción segura de aguas residuales domésticas e
              industriales.
            </p>
          </div>
          <div className="surface-soft">
            <h3 className="mb-2 text-lg font-semibold">Tratamiento de aguas residuales</h3>
            <p className="text-sm text-slate-600">
              Procesos de tratamiento para mitigar contaminantes antes de la disposición final en
              cuerpos hídricos.
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="page-section-title">Servicios complementarios</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
          <li>Análisis de calidad de agua</li>
          <li>Revisión y mantenimiento de instalaciones</li>
          <li>Asesoría técnica para proyectos de construcción</li>
          <li>Programas de educación ambiental</li>
          <li>Atención de emergencias 24/7 (línea 116)</li>
        </ul>
      </section>
    </div>
  );
};

export default Services;
