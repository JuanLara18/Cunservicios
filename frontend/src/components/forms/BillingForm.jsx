import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
        <Form className="max-w-md">
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || isLoading}
          >
            {isLoading ? "Consultando..." : "Consultar factura"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default BillingForm;
