import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 py-12 text-slate-100">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">CUNSERVICIOS</h3>
            <p className="text-sm text-slate-300">
              Plataforma digital para gestión de servicios, facturación y atención de usuarios.
            </p>
            <p className="text-sm text-slate-400">
              Chía, Cundinamarca · Colombia
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">Navegación</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <FooterLink to="/" label="Inicio" />
              <FooterLink to="/servicios" label="Servicios" />
              <FooterLink to="/facturacion" label="Facturación" />
              <FooterLink to="/pqr" label="PQR" />
              <FooterLink to="/contacto" label="Contacto" />
              <FooterLink to="/portal" label="Portal clientes" />
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">Canales</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="tel:+6011234567" className="hover:text-white">
                  Línea de atención: (601) 123-4567
                </a>
              </li>
              <li>
                <a href="mailto:atencion@cunserviciosesp.com" className="hover:text-white">
                  atencion@cunserviciosesp.com
                </a>
              </li>
              <li className="text-slate-400">Lunes a viernes: 8:00 AM - 5:00 PM</li>
              <li className="text-slate-400">Sábados: 8:00 AM - 12:00 PM</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-lg font-semibold text-white">Atención de emergencias</h3>
            <p className="mt-2 text-sm text-slate-300">
              Reporta incidentes de acueducto o alcantarillado en cualquier momento.
            </p>
            <a href="tel:116" className="btn btn-primary mt-4 btn-mobile-full">
              Llamar al 116
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-6 text-sm text-slate-400 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Cunservicios. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/terminos" className="hover:text-white">
              Términos y condiciones
            </Link>
            <Link to="/privacidad" className="hover:text-white">
              Política de privacidad
            </Link>
            <Link to="/transparencia" className="hover:text-white">
              Transparencia
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }) => (
  <li>
    <Link to={to} className="hover:text-white">
      {label}
    </Link>
  </li>
);

export default Footer;
