import React from "react";

const FacturaDetail = ({ factura, onPagar, onDownload }) => {
  if (!factura) return null;

  const handlePrint = () => {
    // Crear una clase de estilos de impresión específica
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .factura-imprimir, .factura-imprimir * {
          visibility: visible;
        }
        .factura-imprimir {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
        .header-print {
          text-align: center;
          margin-bottom: 20px;
        }
        .header-print h1 {
          font-size: 22px;
          margin-bottom: 5px;
        }
        .header-print p {
          font-size: 14px;
          margin: 2px 0;
        }
      }
    `;
    document.head.appendChild(printStyles);

    // Imprimir y luego eliminar los estilos
    window.print();
    document.head.removeChild(printStyles);
  };

  return (
    <div className="card bg-white p-6 rounded-lg shadow-md factura-imprimir">
      <div className="header-print" style={{ display: 'none' }}>
        <h1>CUNSERVICIOS E.S.P.</h1>
        <p>NIT: 900.000.000-0</p>
        <p>Dirección: Centro Empresarial TYFA, I, Oficina 402, Chía</p>
        <p>Teléfono: (601) 123-4567</p>
        <p>Factura de Servicios Públicos</p>
      </div>
      
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
            {factura.conceptos && factura.conceptos.map((item, index) => (
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

      <div className="flex justify-between no-print">
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn btn-secondary">
            Imprimir factura
          </button>
          {onDownload && (
            <button onClick={onDownload} className="btn btn-outline">
              Descargar PDF
            </button>
          )}
        </div>
        {factura.estado !== "Pagada" && (
          <button onClick={onPagar} className="btn btn-primary">
            Pagar ahora
          </button>
        )}
      </div>
    </div>
  );
};

export default FacturaDetail;