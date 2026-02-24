import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Billing = () => {
  return (
    <div className="page-shell fade-in space-y-6">
      <Helmet>
        <title>Facturación | Cunservicios</title>
        <meta
          name="description"
          content="Flujo de facturación institucional y canales de soporte de Cunservicios."
        />
      </Helmet>

      <section className="page-hero">
        <h1 className="page-title">Facturación</h1>
        <p className="page-subtitle">
          Flujo claro para consultar recibos y gestionar facturación desde el portal institucional.
        </p>
      </section>

      <section className="card space-y-4">
        <h2 className="page-section-title">¿Cómo consultar facturas?</h2>
        <ol className="space-y-2 text-sm text-slate-700">
          <li>
            <strong>1. Ingresa al portal de clientes.</strong> Accede con tenant y usuario
            institucional.
          </li>
          <li>
            <strong>2. Revisa la sección Recibos.</strong> Allí podrás ver histórico y generar
            comprobantes.
          </li>
          <li>
            <strong>3. Descarga y comparte.</strong> Exporta en TXT o Markdown según la necesidad
            operativa.
          </li>
        </ol>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/portal/login" className="btn btn-primary btn-mobile-full">
            Ingresar al portal
          </Link>
          <Link to="/contacto" className="btn btn-outline btn-mobile-full">
            Contactar soporte
          </Link>
        </div>
      </section>

      <section className="card">
        <h2 className="page-section-title">Seguridad y privacidad</h2>
        <p className="mt-2 text-sm text-slate-700">
          Para proteger información sensible no se expone consulta pública por número de cuenta en
          el sitio abierto. La gestión de facturación se realiza dentro del portal autenticado.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold">¿Qué puedes hacer en el portal?</h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-slate-700">
            <li>Consultar recibos recientes.</li>
            <li>Generar recibos por período y componentes.</li>
            <li>Descargar evidencias para control interno.</li>
            <li>Actualizar datos de operación por tenant.</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold">Canales alternos</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>
              Línea de atención:{" "}
              <a className="font-medium text-indigo-600 hover:underline" href="tel:+6011234567">
                (601) 123-4567
              </a>
            </li>
            <li>
              Correo:{" "}
              <a
                className="font-medium text-indigo-600 hover:underline"
                href="mailto:atencion@cunserviciosesp.com"
              >
                atencion@cunserviciosesp.com
              </a>
            </li>
            <li>Horario: lunes a viernes de 8:00 AM a 5:00 PM.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Billing;
