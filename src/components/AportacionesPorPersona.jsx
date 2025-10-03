import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { BadgePlus } from "lucide-react";

export const AportacionesPorPersona = ({
  aportaciones = [],
  retiradas = [],
}) => {
  // Función para calcular total neto de una persona
  const calcularTotal = (persona) => {
    const totalAportado = aportaciones
      .filter((a) => a.persona === persona)
      .reduce((sum, a) => sum + Number(a.cantidad || 0), 0);

    const totalRetirado = retiradas
      .filter((r) => r.persona === persona)
      .reduce((sum, r) => sum + Number(r.cantidad || 0), 0);

    return totalAportado - totalRetirado;
  };

  const totalGaby = calcularTotal("Gaby");
  const totalPablo = calcularTotal("Pablo");

  const datosPastel = [
    { name: "Gaby", value: totalGaby > 0 ? totalGaby : 0, color: "#ec4899" },
    { name: "Pablo", value: totalPablo > 0 ? totalPablo : 0, color: "#3b82f6" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BadgePlus className="w-5 h-5 text-indigo-600" />
        Aportaciones netas
      </h2>

      <div className="space-y-3">
        {["Gaby", "Pablo"].map((persona) => {
          const total = calcularTotal(persona);
          const color = persona === "Gaby" ? "pink" : "blue";
          return (
            <div
              key={persona}
              className={`flex justify-between items-center p-4 bg-${color}-50 rounded-lg border-2 border-${color}-200`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-${color}-500 flex items-center justify-center text-white font-bold`}
                >
                  {persona[0]}
                </div>
                <span className="font-semibold text-gray-800">{persona}</span>
              </div>
              <span
                className={`text-lg font-bold ${
                  total >= 0 ? `text-${color}-600` : "text-red-600"
                }`}
              >
                {total >= 0 ? "" : "-"}
                {Math.abs(total).toLocaleString("es-ES")} €
              </span>
            </div>
          );
        })}
      </div>

      {(totalGaby > 0 || totalPablo > 0) && (
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={datosPastel}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {datosPastel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value.toLocaleString("es-ES")} €`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
