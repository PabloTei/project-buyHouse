import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartNoAxesCombined } from "lucide-react";

export const GraficoEvolucion = ({
  aportaciones = [],
  retiradas = [],
  valorCasa,
  totalNeto = 0, // nuevo prop
}) => {
  const entradaNecesaria = Number(valorCasa) * 0.3;

  // Combinar movimientos y ordenarlos por fecha
  const movimientos = [
    ...aportaciones.map((a) => ({ ...a, tipo: "aportacion" })),
    ...retiradas.map((r) => ({ ...r, tipo: "retirada" })),
  ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // Calcular acumulado neto a lo largo del tiempo (para la gráfica)
  let acumulado = 0;
  const datosProgreso = movimientos.map((mov) => {
    acumulado +=
      mov.tipo === "aportacion" ? Number(mov.cantidad) : -Number(mov.cantidad);
    return {
      fecha: new Date(mov.fecha).toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
      }),
      acumulado,
      meta: entradaNecesaria,
    };
  });

  if (!datosProgreso.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ChartNoAxesCombined className="w-5 h-5 text-indigo-600" />
        Evolución del Ahorro
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datosProgreso}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) => `${value.toLocaleString("es-ES")} €`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="acumulado"
            stroke="#6366f1"
            strokeWidth={3}
            name="Ahorrado Neto"
          />
          <Line
            type="monotone"
            dataKey="meta"
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Meta"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
