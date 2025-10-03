import React from "react";
import { HouseHeart } from "lucide-react";

export const CasaPosible = ({ totalNeto }) => {
  // Calcular valor máximo de casa que puedes permitir
  const valorMaximoCasa = totalNeto / 0.3;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <HouseHeart className="w-5 h-5 text-indigo-600" />
        Casa permitida
      </h2>
      <p className="text-gray-700 mb-2">
        Con el ahorro actual de{" "}
        <span className="font-semibold">
          {totalNeto.toLocaleString("es-ES")} €
        </span>
        , suponiendo que necesitas el 30 % del valor de la casa como entrada,
        podrías permitirte una vivienda de hasta:
      </p>
      <p className="text-2xl font-bold text-indigo-600">
        {valorMaximoCasa.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
      </p>
    </div>
  );
};
