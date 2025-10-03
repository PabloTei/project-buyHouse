import React from "react";
import { LoaderCircle } from "lucide-react";

export const ResumenProgreso = ({
  aportaciones = [],
  retiradas = [],
  valorCasa,
  ahorroMensual,
  fechaInicio,
}) => {
  const entradaNecesaria = Number(valorCasa) * 0.3;

  // Calcular total neto por persona
  const totalAportado = aportaciones.reduce(
    (sum, ap) => sum + (Number(ap.cantidad) || 0),
    0
  );
  const totalRetirado = retiradas.reduce(
    (sum, r) => sum + (Number(r.cantidad) || 0),
    0
  );
  const totalNeto = totalAportado - totalRetirado;

  const restantePorAhorrar = Math.max(0, entradaNecesaria - totalNeto);
  const porcentajeCompletado =
    entradaNecesaria > 0 ? (totalNeto / entradaNecesaria) * 100 : 0;

  const mesesRestantes =
    ahorroMensual > 0 ? Math.ceil(restantePorAhorrar / ahorroMensual) : 0;

  const fechaEstimada = fechaInicio?.toDate
    ? fechaInicio.toDate()
    : new Date(fechaInicio);
  fechaEstimada.setMonth(fechaEstimada.getMonth() + mesesRestantes);

  const fechaFormateada = fechaEstimada.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  // Capitalizar la primera letra
  const fechaCapitalizada =
    fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <LoaderCircle className="w-5 h-5 text-indigo-600" />
        Progreso
      </h2>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
            {porcentajeCompletado.toFixed(1)}%
          </span>
          <span className="text-xs font-semibold inline-block text-indigo-600">
            {totalNeto.toLocaleString("es-ES")} €
          </span>
        </div>

        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-indigo-200">
          <div
            style={{ width: `${Math.min(porcentajeCompletado, 100)}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
          />
        </div>
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Total aportado
          </span>
          <span className="text-lg font-bold text-green-600">
            {totalAportado.toLocaleString("es-ES")} €
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Total retirado
          </span>
          <span className="text-lg font-bold text-red-600">
            {totalRetirado.toLocaleString("es-ES")} €
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Neto ahorrado
          </span>
          <span className="text-lg font-bold text-yellow-600">
            {totalNeto.toLocaleString("es-ES")} €
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Falta por ahorrar
          </span>
          <span className="text-lg font-bold text-blue-600">
            {restantePorAhorrar.toLocaleString("es-ES")} €
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Meses restantes
          </span>
          <span className="text-lg font-bold text-purple-600">
            {mesesRestantes} {mesesRestantes === 1 ? "mes" : "meses"}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Fecha estimada
          </span>
          <span className="text-lg font-bold text-indigo-600">
            {fechaCapitalizada}
          </span>
        </div>
      </div>
    </div>
  );
};
