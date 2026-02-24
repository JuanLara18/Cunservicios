import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import FacturaDetail from "../components/common/FacturaDetail";
import BillingForm from "../components/forms/BillingForm";
import { facturaService } from "../services/api";
import { getLatestFactura, mapFacturaFromApi } from "../services/mappers";

/**
 * Página de facturación que permite a los usuarios consultar y pagar sus facturas
 */
const Billing = () => {
  // Estados para manejar la factura, carga, errores, y estado de pago
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  
  // Eliminar mensajes de éxito después de 5 segundos
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [successMessage]);

  /**
   * Maneja la consulta de la factura cuando el usuario envía el formulario
   * @param {Object} values - Valores del formulario
   * @param {Object} formikActions - Acciones del formulario Formik
   */
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setFactura(null);
    setShowPaymentForm(false);

    try {
      const response = await facturaService.getFacturasPorCuenta(values.numeroCuenta);
      const latestFactura = getLatestFactura(response.data);

      if (!latestFactura) {
        setError("No se encontró factura para el número de cuenta proporcionado");
        return;
      }

      setFactura(mapFacturaFromApi(latestFactura));
    } catch (err) {
      console.error("Error al consultar factura:", err);
      const statusCode = err?.response?.status;
      const apiDetail = err?.response?.data?.detail;
      if (statusCode === 401 || statusCode === 403) {
        setError("Debes ingresar al Portal clientes para consultar o pagar facturas.");
        return;
      }
      setError(
        typeof apiDetail === "string"
          ? apiDetail
          : "Ocurrió un error al consultar la factura. Por favor intente nuevamente."
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  /**
   * Inicia el proceso de pago de factura
   */
  const handlePagar = () => {
    setShowPaymentForm(true);
  };

  /**
   * Procesa el pago de la factura
   * @param {Event} e - Evento del formulario
   */
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setIsPaying(true);
    setError("");
    
    try {
      const response = await facturaService.pagarFactura(factura.numeroFactura, {
        paymentMethod,
      });
      setFactura(mapFacturaFromApi(response.data));
      
      setSuccessMessage("¡Pago realizado con éxito! Se ha enviado el comprobante a su correo.");
      setShowPaymentForm(false);
    } catch (err) {
      console.error("Error al procesar pago:", err);
      const statusCode = err?.response?.status;
      const apiDetail = err?.response?.data?.detail;
      if (statusCode === 401 || statusCode === 403) {
        setError("Tu sesión no es válida. Ingresa al Portal clientes e intenta de nuevo.");
        return;
      }
      setError(
        typeof apiDetail === "string"
          ? apiDetail
          : "Ocurrió un error al procesar el pago. Por favor intente nuevamente."
      );
    } finally {
      setIsPaying(false);
    }
  };

  /**
   * Maneja la descarga de la factura en formato PDF
   */
  const handleDownloadFactura = () => {
    // En producción, esta función podría descargar un PDF real
    // Por ahora, simulamos una alerta
    alert(`Descargando factura ${factura.numeroFactura} en PDF...`);
    
    // Alternativa para producción:
    // window.open(`${process.env.REACT_APP_API_URL}/api/facturas/${factura.numeroFactura}/pdf`);
  };

  return (
    <div className="container mx-auto py-8 px-4 fade-in">
      <Helmet>
        <title>Facturación | Cunservicios</title>
        <meta name="description" content="Consulta y paga tus facturas de acueducto y alcantarillado" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Facturación</h1>

      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">Consulta tu factura</h2>
        <BillingForm onSubmit={handleSubmit} isLoading={loading} />
      </div>

      {/* Mensajes de éxito */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8 fade-in">
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 fade-in">
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Detalles de factura */}
      {factura && !showPaymentForm && (
        <FacturaDetail 
          factura={factura} 
          onPagar={handlePagar} 
          onDownload={handleDownloadFactura}
        />
      )}

      {/* Formulario de pago */}
      {showPaymentForm && factura && (
        <div className="card bg-white p-6 rounded-lg shadow-md mb-8 fade-in">
          <h2 className="text-2xl font-semibold mb-4">Realizar pago</h2>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-medium">Resumen de factura</p>
            <p>Número: {factura.numeroFactura}</p>
            <p>Total a pagar: ${factura.valorTotal.toLocaleString()}</p>
          </div>

          <form onSubmit={handleProcessPayment}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Método de pago
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === "creditCard"}
                    onChange={() => setPaymentMethod("creditCard")}
                  />
                  <span className="ml-2">Tarjeta de Crédito</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="paymentMethod"
                    value="pse"
                    checked={paymentMethod === "pse"}
                    onChange={() => setPaymentMethod("pse")}
                  />
                  <span className="ml-2">PSE</span>
                </label>
              </div>
            </div>

            {paymentMethod === "creditCard" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Número de tarjeta
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Fecha expiración
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Código CVV
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre en la tarjeta
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Nombre completo"
                  />
                </div>
              </>
            )}

            {paymentMethod === "pse" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Banco
                  </label>
                  <select className="form-input">
                    <option value="">Seleccione su banco</option>
                    <option value="bancolombia">Bancolombia</option>
                    <option value="davivienda">Davivienda</option>
                    <option value="bbva">BBVA</option>
                    <option value="popular">Banco Popular</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo de cuenta
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="accountType"
                        value="savings"
                      />
                      <span className="ml-2">Ahorros</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="accountType"
                        value="checking"
                      />
                      <span className="ml-2">Corriente</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo de persona
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="personType"
                        value="natural"
                      />
                      <span className="ml-2">Natural</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="personType"
                        value="juridica"
                      />
                      <span className="ml-2">Jurídica</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPaymentForm(false)}
                disabled={isPaying}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPaying}
              >
                {isPaying ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando pago...
                  </span>
                ) : (
                  `Pagar $${factura.valorTotal.toLocaleString()}`
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sección de información adicional */}
      <div className="card bg-blue-50">
        <h2 className="text-2xl font-semibold mb-4">Información importante</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>El pago de tu factura se puede realizar hasta la fecha de vencimiento sin recargos.</li>
          <li>Puedes pagar en línea a través de nuestra plataforma o en los puntos de pago autorizados.</li>
          <li>Si tienes alguna duda sobre tu factura, puedes radicar una PQR desde la sección correspondiente.</li>
          <li>Recuerda mantener actualizada tu información de contacto para recibir notificaciones.</li>
          <li>Los pagos realizados después de las 4:00 PM serán aplicados al siguiente día hábil.</li>
        </ul>
      </div>

      {/* Sección de preguntas frecuentes sobre facturación */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Preguntas frecuentes</h2>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-lg mb-2">¿Cómo interpretar mi factura?</h3>
            <p>Tu factura incluye cargos fijos y variables. Los cargos fijos son independientes del consumo, mientras que los variables dependen del volumen de agua consumido en el periodo.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-lg mb-2">¿Qué hacer si mi factura tiene un valor inusual?</h3>
            <p>Si detectas un valor anormalmente alto, puede deberse a una fuga interna o error de lectura. Puedes solicitar una revisión a través de nuestra sección de PQR.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-lg mb-2">¿Cuándo se genera mi factura?</h3>
            <p>Las facturas se generan mensualmente según tu ciclo de facturación. Puedes consultar tu ciclo contactando a nuestro servicio al cliente.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;