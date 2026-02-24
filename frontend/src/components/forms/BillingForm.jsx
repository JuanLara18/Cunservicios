// frontend/src/components/forms/BillingForm.jsx (ajuste parcial)
// Modificamos para incluir el manejo de errores de la API
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const BillingFormSchema = Yup.object().shape({
  numeroCuenta: Yup.string()
    .required("El número de cuenta es requerido")
    .matches(/^[0-9]+$/, "El número de cuenta debe contener solo números"),
});

const BillingForm = ({ onSubmit, isLoading }) => {
  return (
    <Formik
      initialValues={{ numeroCuenta: "" }}
      validationSchema={BillingFormSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="w-full max-w-2xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="form-group mb-0">
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
            <button
              type="submit"
              className="btn btn-primary btn-mobile-full"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Consultando..." : "Consultar factura"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BillingForm;