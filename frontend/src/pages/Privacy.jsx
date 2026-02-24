import React from "react";

const Privacy = () => {
  return (
    <div className="page-shell space-y-6">
      <section className="page-hero">
        <h1 className="page-title">Política de privacidad</h1>
        <p className="page-subtitle">
          Lineamientos de tratamiento de datos personales y protección de información.
        </p>
      </section>

      <div className="space-y-4">
        <section className="card">
          <h2 className="text-xl font-semibold mb-3">
            1. Tratamiento de datos personales
          </h2>
          <p className="text-slate-700">
            El tratamiento de datos personales se realiza conforme a la normativa
            colombiana aplicable, incluyendo la Ley 1581 de 2012 y sus decretos
            reglamentarios.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold mb-3">2. Finalidad</h2>
          <p className="text-slate-700">
            Los datos son utilizados para la operación del servicio, atención de PQR,
            gestión de facturación, notificaciones y cumplimiento de obligaciones
            legales y regulatorias.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold mb-3">3. Derechos del titular</h2>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li>Conocer, actualizar y rectificar sus datos.</li>
            <li>Solicitar prueba de la autorización otorgada.</li>
            <li>Revocar la autorización cuando proceda legalmente.</li>
            <li>Presentar consultas y reclamos ante el responsable del tratamiento.</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold mb-3">4. Seguridad de la información</h2>
          <p className="text-slate-700">
            Se implementan controles administrativos y técnicos para proteger la
            confidencialidad, integridad y disponibilidad de la información.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;

