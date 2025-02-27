import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ContactSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es requerido"),
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
  telefono: Yup.string().required("El teléfono es requerido"),
  asunto: Yup.string().required("El asunto es requerido"),
  mensaje: Yup.string()
    .required("El mensaje es requerido")
    .min(10, "El mensaje debe tener al menos 10 caracteres"),
});

const Contact = () => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Simulación de envío
    setTimeout(() => {
      alert("Mensaje enviado correctamente");
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Contacto</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Envíanos un mensaje</h2>
          <Formik
            initialValues={{
              nombre: "",
              correo: "",
              telefono: "",
              asunto: "",
              mensaje: "",
            }}
            validationSchema={ContactSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">
                    Nombre completo
                  </label>
                  <Field
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-input"
                    placeholder="Ingresa tu nombre completo"
                  />
                  <ErrorMessage
                    name="nombre"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="correo" className="form-label">
                    Correo electrónico
                  </label>
                  <Field
                    type="email"
                    id="correo"
                    name="correo"
                    className="form-input"
                    placeholder="Ingresa tu correo electrónico"
                  />
                  <ErrorMessage
                    name="correo"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono de contacto
                  </label>
                  <Field
                    type="text"
                    id="telefono"
                    name="telefono"
                    className="form-input"
                    placeholder="Ingresa tu teléfono"
                  />
                  <ErrorMessage
                    name="telefono"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="asunto" className="form-label">
                    Asunto
                  </label>
                  <Field
                    type="text"
                    id="asunto"
                    name="asunto"
                    className="form-input"
                    placeholder="Ingresa el asunto de tu mensaje"
                  />
                  <ErrorMessage
                    name="asunto"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje" className="form-label">
                    Mensaje
                  </label>
                  <Field
                    as="textarea"
                    id="mensaje"
                    name="mensaje"
                    className="form-input h-32"
                    placeholder="Escribe tu mensaje"
                  />
                  <ErrorMessage
                    name="mensaje"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div>
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Información de contacto</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Dirección</h3>
                <p>CENTRO EMPRESARIAL TYFA, I, Oficina 402-Autonorte</p>
                <p>Costado Occidental, Chía, Cundinamarca, Colombia</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Teléfonos</h3>
                <p>Línea de atención: (601) 123-4567</p>
                <p>Emergencias: 116</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Correo electrónico</h3>
                <p>atencion@cunserviciosesp.com</p>
                <p>operativo@cunserviciosesp.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Horario de atención</h3>
                <p>Lunes a viernes: 8:00 AM - 5:00 PM</p>
                <p>Sábados: 8:00 AM - 12:00 PM</p>
              </div>
            </div>
          </div>

          <div className="card bg-blue-50">
            <h2 className="text-2xl font-semibold mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">¿Cómo puedo pagar mi factura?</h3>
                <p>Puedes pagar tu factura en línea a través de nuestra plataforma o en puntos de pago autorizados.</p>
              </div>
              <div>
                <h3 className="font-semibold">¿Qué hago si hay un daño en mi sector?</h3>
                <p>Reporta inmediatamente a nuestra línea de emergencias 116, disponible 24/7.</p>
              </div>
              <div>
                <h3 className="font-semibold">¿Cómo solicito un nuevo servicio?</h3>
                <p>Debes radicar una solicitud a través de nuestra plataforma de trámites o en nuestras oficinas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Nuestra ubicación</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            {/* Aquí iría un iframe de Google Maps */}
            <div className="bg-gray-200 h-80 flex items-center justify-center">
              <p className="text-gray-500">Mapa de ubicación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
