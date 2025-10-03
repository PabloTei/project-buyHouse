// Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { PiggyBank } from "lucide-react"; // icono chulo de ahorro

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      onLogin(userCredential.user);
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const puedeEntrar = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        {/* Icono y título */}
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full shadow-lg">
            <PiggyBank className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido 👋</h1>
        <p className="text-gray-500 mb-6">
          Te ayudamos a{" "}
          <span className="font-semibold text-indigo-600">ahorrar dinero</span>{" "}
          para cumplir tu sueño 🏡
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={!puedeEntrar}
            className={`w-full py-2 rounded-lg font-semibold shadow-md transition-all ${
              puedeEntrar
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            Entrar
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          AhorroCasa © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
