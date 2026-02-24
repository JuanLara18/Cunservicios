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
    <div className="card factura-imprimir">
      <div className="header-print" style={{ display: 'none' }}>
        <h1>CUNSERVICIOS E.S.P.</h1>
        <p>NIT: 900.000.000-0</p>
        <p>Dirección: Centro Empresarial TYFA, I, Oficina 402, Chía</p>
        <p>Teléfono: (601) 123-4567</p>
        <p>Factura de Servicios Públicos</p>
      </div>
      
      <h2 className="page-section-title mb-4">Detalles de factura</h2>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      <div className="table-responsive mb-6">
        <table className="table">
          <thead>
            <tr>
              <th>
                Concepto
              </th>
              <th className="text-right">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {factura.conceptos && factura.conceptos.map((item, index) => (
              <tr key={index}>
                <td className="text-slate-900">
                  {item.concepto}
                </td>
                <td className="text-right text-slate-900">
                  ${item.valor.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50">
            <tr>
              <td className="font-medium text-slate-900">
                Total a pagar
              </td>
              <td className="text-right font-medium text-slate-900">
                ${factura.valorTotal.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="no-print flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button onClick={handlePrint} className="btn btn-secondary btn-mobile-full">
            Imprimir factura
          </button>
          {onDownload && (
            <button onClick={onDownload} className="btn btn-outline btn-mobile-full">
              Descargar PDF
            </button>
          )}
        </div>
        {factura.estado !== "Pagada" && (
          <button onClick={onPagar} className="btn btn-primary btn-mobile-full">
            Pagar ahora
          </button>
        )}
      </div>
    </div>
  );
};

export default FacturaDetail;