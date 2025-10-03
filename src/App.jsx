// App.jsx
import React, { useState, useEffect } from "react";
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
      setUser(null); // 🔹 limpia el estado
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

  return user ? (
    <AhorroCasaApp cerrarSesion={cerrarSesion} />
  ) : (
    <Login onLogin={setUser} />
  );
}

export default App;
