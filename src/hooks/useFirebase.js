import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export const useFirebase = () => {
  const [config, setConfig] = useState({
    valorCasa: 300000,
    ahorroMensual: 1000,
    fechaInicio: new Date().toISOString().split("T")[0],
  });
  const [aportaciones, setAportaciones] = useState([]);
  const [retiradas, setRetiradas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar configuración
  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, "config", "settings"));
        if (configDoc.exists()) setConfig(configDoc.data());
      } catch (error) {
        console.error("Error al cargar configuración:", error);
      }
    };
    cargarConfig();
  }, []);

  // Suscripción en tiempo real a aportaciones
  useEffect(() => {
    const q = query(collection(db, "aportaciones"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAportaciones(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Suscripción en tiempo real a retiradas
  useEffect(() => {
    const q = query(collection(db, "retiradas"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRetiradas(data);
    });
    return () => unsubscribe();
  }, []);

  // Guardar configuración
  const guardarConfig = async (nuevaConfig) => {
    try {
      await setDoc(doc(db, "config", "settings"), nuevaConfig);
      setConfig(nuevaConfig);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      throw error;
    }
  };

  // Agregar aportación
  const agregarAportacion = async (persona, cantidad) => {
    try {
      await addDoc(collection(db, "aportaciones"), {
        persona,
        cantidad: parseFloat(cantidad),
        fecha: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error al agregar aportación:", error);
      throw error;
    }
  };

  // Agregar retirada
  const agregarRetirada = async (persona, cantidad, razon) => {
    try {
      await addDoc(collection(db, "retiradas"), {
        persona,
        cantidad: parseFloat(cantidad),
        razon,
        fecha: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error al agregar retirada:", error);
      throw error;
    }
  };

  return {
    config,
    aportaciones,
    retiradas,
    loading,
    guardarConfig,
    agregarAportacion,
    agregarRetirada,
  };
};
