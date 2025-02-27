import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FacturaSchema = Yup.object().shape({
  numeroCuenta: Yup.string()
    .required("El número de cuenta es requerido")
    .matches(/^[0-9]+$/, "El número de cuenta debe contener solo números"),
});

const Billing = () => {
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError("");
    setFactura(null);

    try {
      // Simulación de llamada a API (reemplazar por llamada real)
      // const response = await facturaService.getFacturaPorCuenta(values.numeroCuenta);
      // setFactura(response.data);
      
      // Simulación para pruebas
      setTimeout(() => {
        if (values.numeroCuenta === "123456") {
          setFactura({
            numeroFactura: "F-2024-123456",
            fechaEmision: "2024-02-15",
            fechaVencimiento: "2024-03-15",
            valorTotal: 75000,
            estado: "Pendiente",
            conceptos: [
              { concepto: "Cargo fijo acueducto", valor: 25000 },
              { concepto: "Consumo acueducto", valor: 30000 },
              { concepto: "Cargo fijo alcantarillado", valor: 10000 },
              { concepto: "Servicio alcantarillado", valor: 10000 },
            ],
          });
        } else {
          setError("No se encontró factura para el número de cuenta proporcionado");
        }
        setLoading(false);
        setSubmitting(false);
      }, 1000);
    } catch (err) {
      setError("Ocurrió un error al consultar la factura. Intente nuevamente.");
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handlePagar = () => {
    // Implementar redirección a pasarela de pago
    alert("Redirigiendo a la pasarela de pago...");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Facturación</h1>

      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">Consulta tu factura</h2>
        <Formik
          initialValues={{ numeroCuenta: "" }}
          validationSchema={FacturaSchema}
          onSubmit={handleSubmit}
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
                disabled={isSubmitting || loading}
              >
                {loading ? "Consultando..." : "Consultar factura"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <p>{error}</p>
        </div>
      )}

      {factura && (
        <div className="card bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Detalles de factura</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 mb-1">Número de factura:</p>
              <p className="font-medium">{factura.numeroFactura}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Estado:</p>
              <p className="font-medium">
                <span
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    factura.estado === "Pagada"
                      ? "bg-green-100 text-green-800"
                      : factura.estado === "Vencida"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {factura.estado}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Fecha de emisión:</p>
              <p className="font-medium">{factura.fechaEmision}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Fecha de vencimiento:</p>
              <p className="font-medium">{factura.fechaVencimiento}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Conceptos</h3>
          <div className="border rounded-lg overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {factura.conceptos.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.concepto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${item.valor.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Total a pagar
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    ${factura.valorTotal.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
            >
              Descargar factura
            </button>
            {factura.estado !== "Pagada" && (
              <button onClick={handlePagar} className="btn btn-primary">
                Pagar ahora
              </button>
            )}
          </div>
        </div>
      )}

      <div className="card bg-blue-50">
        <h2 className="text-2xl font-semibold mb-4">Información importante</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>El pago de tu factura se puede realizar hasta la fecha de vencimiento sin recargos.</li>
          <li>Puedes pagar en línea a través de nuestra plataforma o en los puntos de pago autorizados.</li>
          <li>Si tienes alguna duda sobre tu factura, puedes radicar una PQR.</li>
          <li>Recuerda mantener actualizada tu información de contacto para recibir notificaciones.</li>
        </ul>
      </div>
    </div>
  );
};

export default Billing;
