import React from "react";

const Transparency = () => {
  return (
    <div className="page-shell space-y-6">
      <section className="page-hero">
        <h1 className="page-title">Transparencia y acceso a la información</h1>
        <p className="page-subtitle">
          Publicamos información clave para fortalecer la confianza y el control social.
        </p>
      </section>

      <div className="space-y-4">
        <section className="card">
          <h2 className="text-xl font-semibold mb-3">Compromiso de transparencia</h2>
          <p className="text-slate-700">
            Publicamos información relevante sobre la prestación del servicio para
            facilitar el control social, la trazabilidad de solicitudes y la
            comunicación con los usuarios.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold mb-3">Información disponible</h2>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li>Canales de atención y tiempos de respuesta.</li>
            <li>Estado general de servicios y cortes programados.</li>
            <li>Indicadores operativos y de calidad del servicio.</li>
            <li>Mecanismos para radicación y seguimiento de PQR.</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold mb-3">Marco normativo aplicable</h2>
          <p className="text-slate-700">
            La prestación del servicio y la relación con usuarios se enmarca en la
            regulación de servicios públicos domiciliarios (incluyendo Ley 142 de
            1994) y normas complementarias vigentes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Transparency;

