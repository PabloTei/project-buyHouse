import React, { useState, useEffect } from "react";
import { useFirebase } from "../hooks/useFirebase";
import HeaderAhorro from "./HeaderAhorro";
import { ResumenProgreso } from "./ResumenProgreso";
import { AportacionesPorPersona } from "./AportacionesPorPersona";
import { NuevaAportacion } from "./NuevaAportacion";
import { GraficoEvolucion } from "./GraficoEvolucion";
import { HistoricoAportaciones } from "./HistoricoAportaciones";
import RetirarDinero from "./RetirarDinero";
import { CasaPosible } from "./CasaPosible";
import Footer from "./Footer";

const AhorroCasaApp = ({ cerrarSesion }) => {
  const {
    config,
    aportaciones: fbAportaciones,
    retiradas: fbRetiradas,
    loading,
    guardarConfig: guardarConfigFirebase,
    agregarAportacion: agregarAportacionFirebase,
    agregarRetirada: agregarRetiradaFirebase,
  } = useFirebase();

  const [valorCasa, setValorCasa] = useState(config?.valorCasa ?? 300000);
  const [ahorroMensual, setAhorroMensual] = useState(
    config?.ahorroMensual ?? 1000
  );
  const [fechaInicio, setFechaInicio] = useState(
    config?.fechaInicio ?? new Date().toISOString().split("T")[0]
  );
  const [aportaciones, setAportaciones] = useState([]);
  const [retiradas, setRetiradas] = useState([]);
  const [editandoValor, setEditandoValor] = useState(false);

  const [nuevaPersona, setNuevaPersona] = useState("Gaby");
  const [nuevaCantidad, setNuevaCantidad] = useState("");

  const totalAportado = aportaciones.reduce(
    (sum, a) => sum + Number(a.cantidad),
    0
  );
  const totalRetirado = retiradas.reduce(
    (sum, r) => sum + Number(r.cantidad),
    0
  );
  const totalNeto = totalAportado - totalRetirado;

  useEffect(() => {
    setValorCasa(config?.valorCasa ?? 300000);
    setAhorroMensual(config?.ahorroMensual ?? 1000);
    setFechaInicio(
      config?.fechaInicio ?? new Date().toISOString().split("T")[0]
    );
  }, [config]);

  useEffect(() => {
    if (Array.isArray(fbAportaciones)) {
      setAportaciones(
        fbAportaciones.map((a) => ({ ...a, cantidad: Number(a.cantidad) || 0 }))
      );
    } else setAportaciones([]);
  }, [fbAportaciones]);

  useEffect(() => {
    if (Array.isArray(fbRetiradas)) {
      setRetiradas(
        fbRetiradas.map((r) => ({ ...r, cantidad: Number(r.cantidad) || 0 }))
      );
    } else setRetiradas([]);
  }, [fbRetiradas]);

  const guardarConfiguracion = async () => {
    try {
      await guardarConfigFirebase({
        valorCasa: Number(valorCasa),
        ahorroMensual: Number(ahorroMensual),
        fechaInicio,
      });
      setEditandoValor(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la configuración");
    }
  };

  const handleAgregarAportacion = async () => {
    if (!nuevaCantidad || Number(nuevaCantidad) <= 0) return;
    try {
      await agregarAportacionFirebase(nuevaPersona, Number(nuevaCantidad));
      setNuevaCantidad("");
    } catch (error) {
      console.error(error);
      alert("Error al agregar la aportación");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando datos...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 lg:py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <HeaderAhorro
          valorCasa={valorCasa}
          ahorroMensual={ahorroMensual}
          editandoValor={editandoValor}
          setEditandoValor={setEditandoValor}
          setValorCasa={setValorCasa}
          setAhorroMensual={setAhorroMensual}
          guardarConfiguracion={guardarConfiguracion}
          cerrarSesion={cerrarSesion}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ResumenProgreso
              aportaciones={aportaciones}
              retiradas={retiradas}
              valorCasa={valorCasa}
              ahorroMensual={ahorroMensual}
              fechaInicio={fechaInicio}
            />
            <AportacionesPorPersona
              aportaciones={aportaciones}
              retiradas={retiradas}
            />
            <CasaPosible totalNeto={totalNeto} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <NuevaAportacion
              nuevaPersona={nuevaPersona}
              setNuevaPersona={setNuevaPersona}
              nuevaCantidad={nuevaCantidad}
              setNuevaCantidad={setNuevaCantidad}
              handleAgregarAportacion={handleAgregarAportacion}
            />
            <RetirarDinero />

            <GraficoEvolucion
              aportaciones={aportaciones}
              retiradas={retiradas}
              valorCasa={valorCasa}
              totalNeto={totalNeto}
            />

            <HistoricoAportaciones
              aportaciones={aportaciones}
              retiradas={retiradas}
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AhorroCasaApp;
