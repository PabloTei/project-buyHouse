// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AhorroCasaApp from "./components/AhorroCasaApp";
import { Login } from "./components/Login";
import { auth } from "./firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-indigo-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route
          path="/login"
          element={!user ? <Login onLogin={setUser} /> : <Navigate to="/dashboard" />}
        />

        {/* Ruta privada */}
        <Route
          path="/dashboard"
          element={user ? <AhorroCasaApp cerrarSesion={cerrarSesion} /> : <Navigate to="/login" />}
        />

        {/* Redirección por defecto */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Redirección para cualquier ruta desconocida */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
