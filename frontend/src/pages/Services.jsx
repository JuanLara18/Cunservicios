import React from "react";

const Services = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nuestros Servicios</h1>

      <section className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">Acueducto</h2>
        <p className="mb-4">
          Nuestro servicio de acueducto garantiza el suministro de agua potable con los más altos estándares de calidad, siguiendo rigurosos procesos de tratamiento y control.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Captación y Tratamiento</h3>
            <p>
              Nuestras plantas de tratamiento utilizan tecnología avanzada para garantizar agua segura y de calidad para todos nuestros usuarios.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Distribución</h3>
            <p>
              Contamos con una red de distribución moderna que permite llevar agua potable a todos los hogares de manera eficiente y confiable.
            </p>
          </div>
        </div>
      </section>

      <section className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">Alcantarillado</h2>
        <p className="mb-4">
          El servicio de alcantarillado comprende la recolección, transporte, tratamiento y disposición final de aguas residuales, garantizando la salud pública y la protección del medio ambiente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Red de Recolección</h3>
            <p>
              Nuestra red de alcantarillado está diseñada para recolectar eficientemente las aguas residuales domésticas e industriales.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Tratamiento de Aguas Residuales</h3>
            <p>
              Contamos con plantas de tratamiento que eliminan contaminantes antes de devolver el agua a los cuerpos hídricos naturales.
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">Servicios Complementarios</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Análisis de calidad de agua</li>
          <li>Revisión y mantenimiento de instalaciones</li>
          <li>Asesoría técnica para proyectos de construcción</li>
          <li>Programas de educación ambiental</li>
          <li>Atención de emergencias 24/7</li>
        </ul>
      </section>
    </div>
  );
};

export default Services;
