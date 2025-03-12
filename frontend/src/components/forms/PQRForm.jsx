import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const PQRFormSchema = Yup.object().shape({
  tipo: Yup.string().required("Seleccione un tipo de solicitud"),
  numero_cuenta: Yup.string()
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

const PQRForm = ({ onSubmit, isLoading }) => {
  return (
    <Formik
      initialValues={{
        tipo: "",
        numero_cuenta: "",
        nombre: "",
        correo: "",
        telefono: "",
        asunto: "",
        descripcion: "",
        aceptaTerminos: false,
      }}
      validationSchema={PQRFormSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div className="form-group">
            <label htmlFor="tipo" className="form-label">
              Tipo de solicitud
            </label>
            <Field
              as="select"
              id="tipo"
              name="tipo"
              className="form-input"
            >
              <option value="">Seleccione una opción</option>
              <option value="PETICION">Petición</option>
              <option value="QUEJA">Queja</option>
              <option value="RECLAMO">Reclamo</option>
              <option value="SUGERENCIA">Sugerencia</option>
              <option value="DENUNCIA">Denuncia</option>
            </Field>
            <ErrorMessage
              name="tipo"
              component="div"
              className="form-error"
            />
          </div>

          <div className="form-group">
            <label htmlFor="numero_cuenta" className="form-label">
              Número de cuenta
            </label>
            <Field
              type="text"
              id="numero_cuenta"
              name="numero_cuenta"
              className="form-input"
              placeholder="Ingresa tu número de cuenta"
            />
            <ErrorMessage
              name="numero_cuenta"
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
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PQRForm;