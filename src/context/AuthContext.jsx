import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// ══════════════════════════════════════════════
// Cambiar a la URL donde corre la API de tu compañero
// En tu laptop: http://localhost:8080
// En red: http://192.168.X.X:8080
// ══════════════════════════════════════════════
const API_URL = "http://localhost:8080";

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

  // Fetch helper que usa la API_URL
  async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
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
