import React, { useState } from "react";
import { Filter, History, X } from "lucide-react";

export const HistoricoAportaciones = ({
  aportaciones = [],
  retiradas = [],
}) => {
  const [popupVisible, setPopupVisible] = useState(false);

  // Estados de filtros aplicados
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    persona: "",
    tipo: "",
    fechaInicio: "",
    fechaFin: "",
    cantidadMin: "",
    cantidadMax: "",
  });

  // Estados temporales del modal
  const [tempPersona, setTempPersona] = useState(filtrosAplicados.persona);
  const [tempTipo, setTempTipo] = useState(filtrosAplicados.tipo);
  const [tempFechaInicio, setTempFechaInicio] = useState(
    filtrosAplicados.fechaInicio
  );
  const [tempFechaFin, setTempFechaFin] = useState(filtrosAplicados.fechaFin);
  const [tempCantidadMin, setTempCantidadMin] = useState(
    filtrosAplicados.cantidadMin
  );
  const [tempCantidadMax, setTempCantidadMax] = useState(
    filtrosAplicados.cantidadMax
  );

  // Combinar aportaciones y retiradas
  const historico = [
    ...aportaciones.map((a) => ({ ...a, tipo: "aportacion" })),
    ...retiradas.map((r) => ({ ...r, tipo: "retirada" })),
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  // Filtrado usando los filtros aplicados
  const historicoFiltrado = historico.filter((mov) => {
    if (filtrosAplicados.persona && mov.persona !== filtrosAplicados.persona)
      return false;
    if (filtrosAplicados.tipo && mov.tipo !== filtrosAplicados.tipo)
      return false;

    const fechaMov = new Date(mov.fecha);
    if (
      filtrosAplicados.fechaInicio &&
      fechaMov < new Date(filtrosAplicados.fechaInicio)
    )
      return false;
    if (
      filtrosAplicados.fechaFin &&
      fechaMov > new Date(filtrosAplicados.fechaFin)
    )
      return false;

    if (
      filtrosAplicados.cantidadMin &&
      Number(mov.cantidad) < Number(filtrosAplicados.cantidadMin)
    )
      return false;
    if (
      filtrosAplicados.cantidadMax &&
      Number(mov.cantidad) > Number(filtrosAplicados.cantidadMax)
    )
      return false;

    return true;
  });

  const aplicarFiltros = () => {
    setFiltrosAplicados({
      persona: tempPersona,
      tipo: tempTipo,
      fechaInicio: tempFechaInicio,
      fechaFin: tempFechaFin,
      cantidadMin: tempCantidadMin,
      cantidadMax: tempCantidadMax,
    });
    setPopupVisible(false);
  };

  const limpiarFiltros = () => {
    setTempPersona("");
    setTempTipo("");
    setTempFechaInicio("");
    setTempFechaFin("");
    setTempCantidadMin("");
    setTempCantidadMax("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          Histórico de Movimientos
        </h2>
        <button
          onClick={() => setPopupVisible(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {popupVisible && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Filtrar movimientos</h3>
              <button
                onClick={() => setPopupVisible(false)}
                className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <select
                value={tempPersona}
                onChange={(e) => setTempPersona(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Todas las personas</option>
                <option value="Gaby">Gaby</option>
                <option value="Pablo">Pablo</option>
              </select>

              <select
                value={tempTipo}
                onChange={(e) => setTempTipo(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Todos los tipos</option>
                <option value="aportacion">Aportaciones</option>
                <option value="retirada">Retiradas</option>
              </select>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={tempFechaInicio}
                  onChange={(e) => setTempFechaInicio(e.target.value)}
                  className="flex-1 border px-3 py-2 rounded-lg"
                />
                <input
                  type="date"
                  value={tempFechaFin}
                  onChange={(e) => setTempFechaFin(e.target.value)}
                  className="flex-1 border px-3 py-2 rounded-lg"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Cantidad min"
                  value={tempCantidadMin}
                  onChange={(e) => setTempCantidadMin(e.target.value)}
                  className="flex-1 border px-3 py-2 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Cantidad max"
                  value={tempCantidadMax}
                  onChange={(e) => setTempCantidadMax(e.target.value)}
                  className="flex-1 border px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={limpiarFiltros}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Limpiar
              </button>
              <button
                onClick={aplicarFiltros}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {historicoFiltrado.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No hay movimientos que coincidan con los filtros.
        </p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {historicoFiltrado.map((movimiento) => (
            <div
              key={movimiento.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                movimiento.tipo === "aportacion"
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-red-50 hover:bg-red-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    movimiento.persona === "Gaby"
                      ? movimiento.tipo === "aportacion"
                        ? "bg-pink-500"
                        : "bg-pink-700"
                      : movimiento.tipo === "aportacion"
                      ? "bg-blue-500"
                      : "bg-blue-700"
                  }`}
                >
                  {movimiento.persona[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {movimiento.persona}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(movimiento.fecha).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {movimiento.tipo === "retirada" && movimiento.razon
                      ? ` - ${movimiento.razon}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-lg font-bold ${
                    movimiento.tipo === "aportacion"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {movimiento.tipo === "aportacion" ? "+" : "-"}
                  {Number(movimiento.cantidad).toLocaleString("es-ES")} €
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
