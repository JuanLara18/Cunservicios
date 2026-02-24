import React from "react";
import { Link } from "react-router-dom";

const PQR = () => {
  return (
    <div className="page-shell space-y-6">
      <section className="page-hero">
        <h1 className="page-title">PQR y soporte</h1>
        <p className="page-subtitle">
          Gestiona peticiones, quejas, reclamos y seguimiento desde un flujo institucional seguro.
        </p>
      </section>

      <section className="card space-y-4">
        <h2 className="page-section-title">Flujo recomendado de PQR</h2>
        <ol className="space-y-2 text-sm text-slate-700">
          <li>
            <strong>1. Ingresa al portal.</strong> Accede con credenciales del tenant.
          </li>
          <li>
            <strong>2. Registra la solicitud.</strong> Carga datos completos y soportes.
          </li>
          <li>
            <strong>3. Consulta estado.</strong> Haz seguimiento dentro del mismo entorno.
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

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold">Tiempos de atención</h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-slate-700">
            <li>Recepción y registro de solicitud.</li>
            <li>Análisis técnico y respuesta del caso.</li>
            <li>Actualización de estado con trazabilidad.</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold">Canales de apoyo</h3>
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

      <section className="card">
        <h2 className="page-section-title">Nota de seguridad</h2>
        <p className="mt-2 text-sm text-slate-700">
          La radicación y consulta de PQR se realiza en el portal autenticado para proteger datos
          del cliente y mantener trazabilidad por tenant.
        </p>
      </section>
    </div>
  );
};

export default PQR;
