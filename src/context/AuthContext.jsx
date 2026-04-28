import { createContext, useContext, useState, useEffect } from "react";
import {
  apiFetch as sharedApiFetch,
  API_ORIGIN,
  getStoredToken,
  setStoredToken,
} from "../services/api";

const AuthContext = createContext(null);

const API_URL = API_ORIGIN;

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validarSesion();
  }, []);

  async function validarSesion() {
    const savedUser = sessionStorage.getItem("user");
    const token = getStoredToken();

    if (!savedUser || !token) {
      logout();
      setLoading(false);
      return;
    }

    try {
      const me = await sharedApiFetch("/api/auth/me");
      const userData = {
        idUsuario: me.idUsuario,
        nombre: me.nombre,
        rol: me.rol,
      };
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function loginWithCredentials(nombre, password) {
    const response = await sharedApiFetch("/api/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ nombre, password }),
    });

    const userData = {
      idUsuario: response.idUsuario,
      nombre: response.nombre,
      rol: response.rol,
    };

    setStoredToken(response.token);
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));

    return userData;
  }

  function logout() {
    setUser(null);
    setStoredToken(null);
    sessionStorage.removeItem("user");
  }

  // Fetch helper compartido para todas las llamadas al backend
  async function apiFetch(path, options = {}) {
    return sharedApiFetch(path, options);
  }

  return (
    <AuthContext.Provider value={{
      user, loading, loginWithCredentials, logout, apiFetch, API_URL,
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
