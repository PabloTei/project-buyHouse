import React, { useState, useEffect } from "react";
import { useFirebase } from "../hooks/useFirebase";
import { BanknoteArrowDown } from "lucide-react";

const RetirarDinero = () => {
  const { agregarRetirada } = useFirebase();
  const [persona, setPersona] = useState("Gaby");
  const [cantidad, setCantidad] = useState("");
  const [razon, setRazon] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  // Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const puedeRetirar = cantidad && Number(cantidad) > 0 && razon.trim();

  const handleRetirar = async () => {
    if (!puedeRetirar) return;

    try {
      await agregarRetirada(persona, cantidad, razon);

      // Mostrar snackbar
      setSnackbarVisible(true);
      setProgress(0);

      let start = 0;
      const interval = setInterval(() => {
        start += 1;
        setProgress(start);
        if (start >= 100) clearInterval(interval);
      }, 30); // dura ~3s

      // Limpiar campos
      setCantidad("");
      setRazon("");
      setPopupVisible(false);
    } catch (error) {
      alert("Error al realizar la retirada. Revisa la consola.");
    }
  };

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => setSnackbarVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BanknoteArrowDown className="w-5 h-5 text-indigo-600" />
          Retirar dinero
        </h2>

        <select
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
        >
          <option value="Gaby">Gaby</option>
          <option value="Pablo">Pablo</option>
        </select>

        <input
          type="number"
          placeholder="Cantidad (€)"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
        />

        <textarea
          placeholder="Motivo de la retirada"
          value={razon}
          onChange={(e) => setRazon(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
        />

        <button
          onClick={() => setPopupVisible(true)}
          disabled={!puedeRetirar}
          className={`px-4 py-2 rounded-lg transition-colors ${
            puedeRetirar
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-red-300 text-white cursor-not-allowed"
          }`}
        >
          Retirar
        </button>

        {popupVisible && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">Confirmar retirada</h3>
              <p>
                ¿Deseas que {persona} retire {cantidad} € por "{razon}"?
              </p>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setPopupVisible(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRetirar}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Snackbar rojo suave */}
      {snackbarVisible && (
        <div className="fixed top-5 right-5 bg-red-400 text-white px-6 py-3 rounded-lg shadow-lg w-80 z-50">
          <p className="font-semibold">¡Oh no! Retirando dinero 😢</p>
          <div className="h-1 bg-red-300 rounded mt-2 overflow-hidden">
            <div
              className="h-full bg-red-500"
              style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RetirarDinero;
