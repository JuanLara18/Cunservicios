import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import PQRForm from "../components/forms/PQRForm";
import { clienteService, pqrService } from "../services/api";

const ConsultaPQRSchema = Yup.object().shape({
  radicado: Yup.string().required("El número de radicado es requerido"),
});

const PQR = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [radicado, setRadicado] = useState("");
  const [consultaError, setConsultaError] = useState("");
  const [consultaResult, setConsultaResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);

  const handleSubmitPQR = async (values) => {
    try {
      setIsSubmitting(true);
      setSubmitError("");
      
      // Primero consultamos el cliente por número de cuenta
      const clienteResponse = await clienteService.getClientePorCuenta(values.numero_cuenta);
      
      // Preparamos los datos para enviar a la API
      const pqrData = {
        tipo: values.tipo,
        asunto: values.asunto,
        descripcion: values.descripcion,
        cliente_id: clienteResponse.data.id
      };
      
      // Enviamos la PQR al backend
      const response = await pqrService.crearPQR(pqrData);
      
      // Guardamos el radicado y mostramos mensaje de éxito
      setRadicado(response.data.radicado);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error al enviar PQR:", error);
      
      // Si el error es que no existe el cliente
      if (error.response && error.response.status === 404) {
        setSubmitError(
          "No se encontró un cliente con ese número de cuenta. Por favor, verifique su información."
        );
      } else {
        setSubmitError("Ocurrió un error al enviar su solicitud. Por favor intente nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsultaPQR = async (values) => {
    try {
      setIsConsulting(true);
      setConsultaError("");
      setConsultaResult(null);
      
      // Consultamos la PQR en el backend
      const response = await pqrService.getPQRPorRadicado(values.radicado);
      
      // Si la solicitud es exitosa, mostramos los datos
      setConsultaResult({
        radicado: response.data.radicado,
        tipo: response.data.tipo,
        estado: response.data.estado,
        fechaCreacion: response.data.fecha_creacion,
        fechaEstimadaRespuesta: 
          response.data.fecha_creacion ? 
          new Date(new Date(response.data.fecha_creacion).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
          null,
        asunto: response.data.asunto,
        descripcion: response.data.descripcion,
      });
    } catch (error) {
      console.error("Error al consultar PQR:", error);
      if (error.response && error.response.status === 404) {
        setConsultaError("No se encontró ningún PQR con el radicado ingresado");
      } else {
        setConsultaError("Ocurrió un error al consultar la PQR. Por favor intente nuevamente.");
      }
    } finally {
      setIsConsulting(false);
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
                    disabled={isSubmitting || isConsulting}
                  >
                    {isConsulting ? "Consultando..." : "Consultar"}
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
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{submitError}</p>
                </div>
              )}
              <PQRForm onSubmit={handleSubmitPQR} isLoading={isSubmitting} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PQR;