import React from "react";

const FacturaDetail = ({ factura, onPagar }) => {
  if (!factura) return null;

  return (
    <div className="card bg-white p-6 rounded-lg shadow-md">
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
          <button onClick={onPagar} className="btn btn-primary">
            Pagar ahora
          </button>
        )}
      </div>
    </div>
  );
};

export default FacturaDetail;
