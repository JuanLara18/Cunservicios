import React from "react";

const Terms = () => {
  return (
    <div className="page-shell space-y-6">
      <section className="page-hero">
        <h1 className="page-title">Términos y condiciones</h1>
        <p className="page-subtitle">
          Condiciones de uso del portal para trámites, facturación y atención digital.
        </p>
      </section>

      <div className="space-y-4">
        <section className="card">
          <h2 className="text-xl font-semibold mb-3">1. Objeto del portal</h2>
          <p className="text-slate-700">
            Este portal permite a los usuarios consultar información de facturación,
            radicar PQR y gestionar solicitudes asociadas a la prestación de servicios
            públicos domiciliarios.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold mb-3">2. Uso adecuado</h2>
          <p className="text-slate-700">
            El usuario se compromete a proporcionar información veraz y a no realizar
            acciones que afecten la disponibilidad, integridad o seguridad de la
            plataforma.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold mb-3">3. Alcance del servicio digital</h2>
          <p className="text-slate-700">
            La plataforma digital no reemplaza los canales presenciales y telefónicos
            oficiales para trámites que por norma requieran validación documental
            adicional.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold mb-3">4. Actualizaciones y cambios</h2>
          <p className="text-slate-700">
            Estos términos podrán actualizarse para cumplir cambios normativos,
            operativos o tecnológicos. Las modificaciones se publicarán en esta
            sección.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;

