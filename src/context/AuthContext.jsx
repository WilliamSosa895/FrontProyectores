import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch as sharedApiFetch, API_ORIGIN } from "../services/api";

const AuthContext = createContext(null);

const API_URL = API_ORIGIN;

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login local — la API no tiene autenticación
  function login(nombre, rol, idUsuario) {
    const userData = { nombre, rol, idUsuario };
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem("user");
  }

  // Fetch helper compartido para todas las llamadas al backend
  async function apiFetch(path, options = {}) {
    return sharedApiFetch(path, options);
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, apiFetch, API_URL,
      isAdmin: user?.rol === "Administrador",
      isDocente: user?.rol === "Docente",
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

export { AuthProvider, useAuth };
export default AuthContext;
