import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const PQRSchema = Yup.object().shape({
  tipoPQR: Yup.string().required("Seleccione un tipo de solicitud"),
  numeroCuenta: Yup.string()
    .required("El número de cuenta es requerido")
    .matches(/^[0-9]+$/, "El número de cuenta debe contener solo números"),
  nombre: Yup.string().required("El nombre es requerido"),
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
  telefono: Yup.string()
    .required("El teléfono es requerido")
    .matches(/^[0-9]+$/, "El teléfono debe contener solo números"),
  asunto: Yup.string().required("El asunto es requerido"),
  descripcion: Yup.string()
    .required("La descripción es requerida")
    .min(20, "La descripción debe tener al menos 20 caracteres"),
  aceptaTerminos: Yup.boolean().oneOf(
    [true],
    "Debe aceptar los términos y condiciones"
  ),
});

const ConsultaPQRSchema = Yup.object().shape({
  radicado: Yup.string().required("El número de radicado es requerido"),
});

const PQR = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [radicado, setRadicado] = useState("");
  const [consultaError, setConsultaError] = useState("");
  const [consultaResult, setConsultaResult] = useState(null);

  const handleSubmitPQR = async (values, { setSubmitting, resetForm }) => {
    try {
      // Simulación de envío a API
      setTimeout(() => {
        const nuevoRadicado = "PQR-" + Date.now().toString().slice(-8);
        setRadicado(nuevoRadicado);
        setSubmitSuccess(true);
        setSubmitting(false);
        resetForm();
      }, 1000);
    } catch (error) {
      console.error("Error al enviar PQR:", error);
      setSubmitSuccess(false);
      setSubmitting(false);
    }
  };

  const handleConsultaPQR = async (values, { setSubmitting }) => {
    try {
      // Simulación de consulta a API
      setTimeout(() => {
        if (values.radicado.startsWith("PQR-")) {
          setConsultaResult({
            radicado: values.radicado,
            tipo: "Petición",
            estado: "En trámite",
            fechaCreacion: "2024-02-15",
            fechaEstimadaRespuesta: "2024-03-01",
            asunto: "Solicitud de revisión de medidor",
            descripcion:
              "El medidor presenta lecturas irregulares en los últimos dos meses.",
          });
          setConsultaError("");
        } else {
          setConsultaError("No se encontró ningún PQR con el radicado ingresado");
          setConsultaResult(null);
        }
        setSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Error al consultar PQR:", error);
      setConsultaError("Ocurrió un error al consultar el PQR");
      setConsultaResult(null);
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Peticiones, Quejas y Reclamos (PQR)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:order-2">
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Consulta el estado de tu PQR</h2>
            <Formik
              initialValues={{ radicado: "" }}
              validationSchema={ConsultaPQRSchema}
              onSubmit={handleConsultaPQR}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="form-group">
                    <label htmlFor="radicado" className="form-label">
                      Número de radicado
                    </label>
                    <Field
                      type="text"
                      id="radicado"
                      name="radicado"
                      className="form-input"
                      placeholder="Ingresa el número de radicado"
                    />
                    <ErrorMessage
                      name="radicado"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Consultando..." : "Consultar"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {consultaError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <p>{consultaError}</p>
            </div>
          )}

          {consultaResult && (
            <div className="card bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Detalles de la solicitud
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">Radicado:</p>
                  <p className="font-medium">{consultaResult.radicado}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">Tipo:</p>
                  <p className="font-medium">{consultaResult.tipo}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">Estado:</p>
                  <p className="font-medium">
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm ${
                        consultaResult.estado === "Cerrado"
                          ? "bg-green-100 text-green-800"
                          : consultaResult.estado === "En trámite"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {consultaResult.estado}
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">Fecha de creación:</p>
                  <p className="font-medium">{consultaResult.fechaCreacion}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">Fecha estimada de respuesta:</p>
                  <p className="font-medium">
                    {consultaResult.fechaEstimadaRespuesta}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">Asunto:</p>
                  <p className="font-medium mt-1">{consultaResult.asunto}</p>
                </div>
                <div>
                  <p className="text-gray-600">Descripción:</p>
                  <p className="mt-1">{consultaResult.descripcion}</p>
                </div>
              </div>
            </div>
          )}

          <div className="card bg-blue-50">
            <h2 className="text-xl font-semibold mb-4">Información importante</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>El tiempo de respuesta para PQR es de 15 días hábiles.</li>
              <li>Puedes adjuntar documentos de soporte a tu solicitud.</li>
              <li>Recuerda anotar el número de radicado para consultas futuras.</li>
              <li>Recibirás notificaciones por correo electrónico sobre el estado de tu solicitud.</li>
            </ul>
          </div>
        </div>

        <div className="lg:order-1">
          {submitSuccess ? (
            <div className="card bg-green-50 border border-green-200">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-center mb-4">
                ¡PQR radicado exitosamente!
              </h2>
              <p className="text-center mb-4">
                Tu solicitud ha sido recibida y será atendida en los próximos días.
              </p>
              <div className="bg-white p-4 rounded-lg mb-4 text-center">
                <p className="text-sm text-gray-600">Tu número de radicado es:</p>
                <p className="text-xl font-bold text-blue-600">{radicado}</p>
              </div>
              <p className="text-sm text-center">
                Guarda este número para consultar el estado de tu solicitud.
              </p>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="btn btn-primary"
                >
                  Radicar otra solicitud
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Radica tu PQR</h2>
              <Formik
                initialValues={{
                  tipoPQR: "",
                  numeroCuenta: "",
                  nombre: "",
                  correo: "",
                  telefono: "",
                  asunto: "",
                  descripcion: "",
                  aceptaTerminos: false,
                }}
                validationSchema={PQRSchema}
                onSubmit={handleSubmitPQR}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="form-group">
                      <label htmlFor="tipoPQR" className="form-label">
                        Tipo de solicitud
                      </label>
                      <Field
                        as="select"
                        id="tipoPQR"
                        name="tipoPQR"
                        className="form-input"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="peticion">Petición</option>
                        <option value="queja">Queja</option>
                        <option value="reclamo">Reclamo</option>
                        <option value="sugerencia">Sugerencia</option>
                        <option value="denuncia">Denuncia</option>
                      </Field>
                      <ErrorMessage
                        name="tipoPQR"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="numeroCuenta" className="form-label">
                        Número de cuenta
                      </label>
                      <Field
                        type="text"
                        id="numeroCuenta"
                        name="numeroCuenta"
                        className="form-input"
                        placeholder="Ingresa tu número de cuenta"
                      />
                      <ErrorMessage
                        name="numeroCuenta"
                        component="div"
                        className="form-error"
                      />
                    </div>

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
                        placeholder="Ingresa el asunto de tu solicitud"
                      />
                      <ErrorMessage
                        name="asunto"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="descripcion" className="form-label">
                        Descripción
                      </label>
                      <Field
                        as="textarea"
                        id="descripcion"
                        name="descripcion"
                        className="form-input h-32"
                        placeholder="Describe detalladamente tu solicitud"
                      />
                      <ErrorMessage
                        name="descripcion"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    <div className="form-group">
                      <div className="flex items-center">
                        <Field
                          type="checkbox"
                          id="aceptaTerminos"
                          name="aceptaTerminos"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="aceptaTerminos"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Acepto los términos y condiciones y autorizo el tratamiento de mis datos personales
                        </label>
                      </div>
                      <ErrorMessage
                        name="aceptaTerminos"
                        component="div"
                        className="form-error"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PQR;
