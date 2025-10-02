import React, { useState, useEffect } from 'react';
import { Home, PiggyBank, TrendingUp, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFirebase } from '../hooks/useFirebase'; // Ajusta la ruta si hace falta

const AhorroCasaApp = () => {
  // Firebase hook
  const {
    config,
    aportaciones: fbAportaciones,
    loading,
    guardarConfig: guardarConfigFirebase,
    agregarAportacion: agregarAportacionFirebase,
    eliminarAportacion: eliminarAportacionFirebase,
  } = useFirebase();

  // Estados locales (edición / UI)
  const [valorCasa, setValorCasa] = useState(config?.valorCasa ?? 300000);
  const [ahorroMensual, setAhorroMensual] = useState(config?.ahorroMensual ?? 1000);
  const [fechaInicio, setFechaInicio] = useState(config?.fechaInicio ?? new Date().toISOString().split('T')[0]);
  const [aportaciones, setAportaciones] = useState([]);
  const [editandoValor, setEditandoValor] = useState(false);

  // Nueva aportación
  const [nuevaPersona, setNuevaPersona] = useState('Gaby');
  const [nuevaCantidad, setNuevaCantidad] = useState('');

  // Mantener estados locales sincronizados cuando cambia la configuración cargada desde Firebase
  useEffect(() => {
    setValorCasa(config?.valorCasa ?? 300000);
    setAhorroMensual(config?.ahorroMensual ?? 1000);
    setFechaInicio(config?.fechaInicio ?? new Date().toISOString().split('T')[0]);
  }, [config]);

  // Mantener aportaciones locales en sync con las aportaciones que vienen de Firebase
  useEffect(() => {
    if (Array.isArray(fbAportaciones)) {
      setAportaciones(
        fbAportaciones.map((a) => ({
          ...a,
          cantidad: Number(a.cantidad) || 0,
        }))
      );
    } else {
      setAportaciones([]);
    }
  }, [fbAportaciones]);

  // Cálculos
  const entradaNecesaria = Number(valorCasa) * 0.3;
  const totalAportado = aportaciones.reduce((sum, ap) => sum + (Number(ap.cantidad) || 0), 0);
  const restantePorAhorrar = Math.max(0, entradaNecesaria - totalAportado);
  const porcentajeCompletado = entradaNecesaria > 0 ? (totalAportado / entradaNecesaria) * 100 : 0;

  const aportacionGaby = aportaciones.filter((ap) => ap.persona === 'Gaby').reduce((sum, ap) => sum + (Number(ap.cantidad) || 0), 0);
  const aportacionPablo = aportaciones.filter((ap) => ap.persona === 'Pablo').reduce((sum, ap) => sum + (Number(ap.cantidad) || 0), 0);

  const mesesRestantes = ahorroMensual > 0 ? Math.ceil(restantePorAhorrar / ahorroMensual) : 0;
  const fechaEstimada = fechaInicio?.toDate 
  ? fechaInicio.toDate() 
  : new Date(fechaInicio);
  fechaEstimada.setMonth(fechaEstimada.getMonth() + mesesRestantes);

  // Guardar configuración en Firebase
  const guardarConfiguracion = async () => {
    try {
      await guardarConfigFirebase({ valorCasa: Number(valorCasa), ahorroMensual: Number(ahorroMensual), fechaInicio });
      setEditandoValor(false);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración. Revisa la consola.');
    }
  };

  // Agregar aportación (usa el hook)
  const handleAgregarAportacion = async () => {
    if (!nuevaCantidad || Number(nuevaCantidad) <= 0) return;
    try {
      await agregarAportacionFirebase(nuevaPersona, Number(nuevaCantidad));
      setNuevaCantidad('');
    } catch (error) {
      console.error('Error al agregar aportación:', error);
      alert('Error al agregar la aportación. Revisa la consola.');
    }
  };

  // Eliminar aportación (usa el hook)
  const handleEliminar = async (id) => {
    try {
      await eliminarAportacionFirebase(id);
    } catch (error) {
      console.error('Error al eliminar aportación:', error);
      alert('Error al eliminar la aportación. Revisa la consola.');
    }
  };

  // Datos para la gráfica de progreso (acumulado)
  const datosProgreso = aportaciones
    .slice()
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .reduce((acc, ap) => {
      const prev = acc.length ? acc[acc.length - 1].acumulado : 0;
      const acumulado = prev + (Number(ap.cantidad) || 0);
      acc.push({
        fecha: new Date(ap.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        acumulado,
        meta: entradaNecesaria,
      });
      return acc;
    }, []);

  // Datos para la gráfica de pastel
  const datosPastel = [
    { name: 'Gaby', value: aportacionGaby, color: '#ec4899' },
    { name: 'Pablo', value: aportacionPablo, color: '#3b82f6' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Home className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Ahorro para Nuestra Casa</h1>
          </div>

          {/* Configuración principal */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Valor de la casa</span>
                {!editandoValor ? (
                  <button onClick={() => setEditandoValor(true)}>
                    <Edit2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={guardarConfiguracion}>
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditandoValor(false)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editandoValor ? (
                <input
                  type="number"
                  value={valorCasa}
                  onChange={(e) => setValorCasa(Number(e.target.value))}
                  className="w-full bg-white/20 rounded px-2 py-1 text-xl font-bold"
                />
              ) : (
                <p className="text-2xl font-bold">{Number(valorCasa).toLocaleString('es-ES')} €</p>
              )}
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <span className="text-sm opacity-90">Entrada necesaria (30%)</span>
              <p className="text-2xl font-bold">{entradaNecesaria.toLocaleString('es-ES')} €</p>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white">
              <span className="text-sm opacity-90">Ahorro mensual estimado</span>
              {editandoValor ? (
                <input
                  type="number"
                  value={ahorroMensual}
                  onChange={(e) => setAhorroMensual(Number(e.target.value))}
                  className="w-full bg-white/20 rounded px-2 py-1 text-xl font-bold"
                />
              ) : (
                <p className="text-2xl font-bold">{Number(ahorroMensual).toLocaleString('es-ES')} € /mes</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Panel izquierdo - Resumen */}
          <div className="md:col-span-1 space-y-6">
            {/* Progreso */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> Progreso
              </h2>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">{porcentajeCompletado.toFixed(1)}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-indigo-600">{totalAportado.toLocaleString('es-ES')} €</span>
                  </div>
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
                  <span className="text-sm font-medium text-gray-700">Total aportado</span>
                  <span className="text-lg font-bold text-green-600">{totalAportado.toLocaleString('es-ES')} €</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Falta por ahorrar</span>
                  <span className="text-lg font-bold text-red-600">{restantePorAhorrar.toLocaleString('es-ES')} €</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Fecha estimada</span>
                  <span className="text-sm font-bold text-blue-600">{fechaEstimada.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Aportaciones por persona */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Aportaciones</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">G</div>
                    <span className="font-semibold text-gray-800">Gaby</span>
                  </div>
                  <span className="text-lg font-bold text-pink-600">{aportacionGaby.toLocaleString('es-ES')} €</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">P</div>
                    <span className="font-semibold text-gray-800">Pablo</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{aportacionPablo.toLocaleString('es-ES')} €</span>
                </div>
              </div>

              {/* Gráfica de pastel */}
              {totalAportado > 0 && (
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
                      <Tooltip formatter={(value) => `${value.toLocaleString('es-ES')} €`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho - Aportaciones y gráfica */}
          <div className="md:col-span-2 space-y-6">
            {/* Nueva aportación */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-indigo-600" /> Agregar Aportación
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
                  onKeyDown={(e) => e.key === 'Enter' && handleAgregarAportacion()}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />

                <button
                  onClick={handleAgregarAportacion}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Agregar
                </button>
              </div>
            </div>

            {/* Gráfica de progreso */}
            {datosProgreso.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Evolución del Ahorro</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={datosProgreso}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => `${value.toLocaleString('es-ES')} €`} />
                    <Legend />
                    <Line type="monotone" dataKey="acumulado" stroke="#6366f1" strokeWidth={3} name="Ahorrado" />
                    <Line type="monotone" dataKey="meta" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Histórico de aportaciones */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Aportaciones</h2>

              {aportaciones.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aún no hay aportaciones. ¡Empieza a ahorrar!</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {aportaciones
                    .slice()
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .map((aportacion) => (
                      <div key={aportacion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${aportacion.persona === 'Gaby' ? 'bg-pink-500' : 'bg-blue-500'} flex items-center justify-center text-white font-bold`}>
                            {aportacion.persona[0]}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">{aportacion.persona}</p>
                            <p className="text-sm text-gray-500">{new Date(aportacion.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-green-600">+{Number(aportacion.cantidad).toLocaleString('es-ES')} €</span>
                          <button onClick={() => handleEliminar(aportacion.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AhorroCasaApp;

