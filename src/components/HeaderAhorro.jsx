import React, { useState } from "react";
import { Home, Edit2, Save, X, LogOut } from "lucide-react";

export const HeaderAhorro = ({
  valorCasa,
  ahorroMensual,
  editandoValor,
  setEditandoValor,
  setValorCasa,
  setAhorroMensual,
  guardarConfiguracion,
  cerrarSesion, // función que hace logout y redirige al login
}) => {
  const [popupCerrar, setPopupCerrar] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      {/* Header con título e iconos de acción */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Home className="w-8 h-8 text-indigo-600" />
        </div>

        <div className="flex items-center gap-4">
          {/* Botones de editar / guardar / cancelar */}
          {!editandoValor ? (
            <button
              onClick={() => setEditandoValor(true)}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
            >
              <Edit2 className="w-5 h-5" /> Editar
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={guardarConfiguracion}
                className="flex items-center gap-1 text-green-600 hover:text-green-800"
              >
                <Save className="w-5 h-5" /> Guardar
              </button>
              <button
                onClick={() => setEditandoValor(false)}
                className="flex items-center gap-1 text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" /> Cancelar
              </button>
            </div>
          )}

          {/* Botón de cerrar sesión */}
          <button
            onClick={() => setPopupCerrar(true)}
            className="p-2 rounded-full hover:bg-red-100 text-red-600"
            title="Cerrar sesión"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Confirmación de cerrar sesión */}
      {popupCerrar && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-bold mb-4">Cerrar sesión</h3>
            <p className="mb-4">¿Estás seguro que quieres cerrar sesión?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setPopupCerrar(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={cerrarSesion}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenedores de valores */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Valor de la casa */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <span className="text-sm opacity-90">Valor de la casa</span>
          {editandoValor ? (
            <input
              type="number"
              value={valorCasa}
              onChange={(e) => setValorCasa(Number(e.target.value))}
              className="w-full bg-white/20 rounded px-2 py-1 text-xl font-bold mt-1"
            />
          ) : (
            <p className="text-2xl font-bold mt-1">
              {Number(valorCasa).toLocaleString("es-ES")} €
            </p>
          )}
        </div>

        {/* Entrada necesaria */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <span className="text-sm opacity-90">Entrada necesaria (30%)</span>
          <p className="text-2xl font-bold mt-1">
            {(valorCasa * 0.3).toLocaleString("es-ES")} €
          </p>
        </div>

        {/* Ahorro mensual */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white">
          <span className="text-sm opacity-90">Ahorro mensual estimado</span>
          {editandoValor ? (
            <input
              type="number"
              value={ahorroMensual}
              onChange={(e) => setAhorroMensual(Number(e.target.value))}
              className="w-full bg-white/20 rounded px-2 py-1 text-xl font-bold mt-1"
            />
          ) : (
            <p className="text-2xl font-bold mt-1">
              {Number(ahorroMensual).toLocaleString("es-ES")} € /mes
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderAhorro;
