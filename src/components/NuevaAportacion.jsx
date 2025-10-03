import React, { useState, useEffect } from "react";
import { PiggyBank, Plus } from "lucide-react";

export const NuevaAportacion = ({
  nuevaPersona,
  setNuevaPersona,
  nuevaCantidad,
  setNuevaCantidad,
  handleAgregarAportacion,
}) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const puedeAgregar =
    nuevaPersona && nuevaCantidad && Number(nuevaCantidad) > 0;

  const handleAgregar = () => {
    if (!puedeAgregar) return;

    handleAgregarAportacion();

    // Mostrar snackbar
    setSnackbarVisible(true);
    setProgress(0);

    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      setProgress(start);
      if (start >= 100) clearInterval(interval);
    }, 30); // dura ~3s
  };

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => setSnackbarVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-indigo-600" /> Agregar aportación
        </h2>

        <div className="flex gap-3">
          <select
            value={nuevaPersona}
            onChange={(e) => setNuevaPersona(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
            <option value="Gaby">Gaby</option>
            <option value="Pablo">Pablo</option>
          </select>

          <input
            type="number"
            placeholder="Cantidad (€)"
            value={nuevaCantidad}
            onChange={(e) => setNuevaCantidad(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
          />

          <button
            onClick={handleAgregar}
            disabled={!puedeAgregar}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              puedeAgregar
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            <Plus className="w-5 h-5" /> Agregar
          </button>
        </div>
      </div>

      {/* Snackbar en esquina superior derecha */}
      {snackbarVisible && (
        <div className="fixed top-5 right-5 bg-green-400 text-white px-6 py-3 rounded-lg shadow-lg w-80 z-50">
          <p className="font-semibold">¡Aportación agregada! Sigue así 😃</p>
          <div className="h-1 bg-green-300 rounded mt-2 overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
