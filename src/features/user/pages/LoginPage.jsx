import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const C = {
  bg: "#1a1a1e", card: "#2a2a2f", border: "#2196F3",
  blue: "#2196F3", white: "#ffffff", textSub: "#9e9e9e",
  red: "#f44336", green: "#4caf50",
};

function LoginPage() {
  const { loginWithCredentials } = useAuth();
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleLogin() {
    if (!nombre.trim() || !password) return;
    setError("");
    setChecking(true);

    try {
      await loginWithCredentials(nombre.trim(), password);
    } catch (err) {
      if (err.status === 401) {
        setError("Credenciales incorrectas. Verifica nombre y contrasena.");
      } else {
        setError("No se puede conectar al servidor. Verifica que el backend este corriendo.");
      }
    } finally {
      setChecking(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    handleLogin();
  }

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
      fontFamily: "'Outfit', system-ui, sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 400, background: C.card,
        borderRadius: 16, padding: 32, border: `1.5px solid ${C.border}`,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: "0 auto 14px",
            border: `2px solid ${C.blue}`, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="10" rx="2"/>
              <circle cx="17" cy="12" r="3"/>
              <line x1="2" y1="12" x2="7" y2="12"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: 0 }}>
            <span style={{ color: C.blue }}>Lux</span>Room
          </h1>
          <p style={{ fontSize: 13, color: C.textSub, marginTop: 6 }}>
            Inicia sesion para continuar
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: C.red + "15", border: `1px solid ${C.red}40`,
            borderRadius: 8, padding: "10px 14px", marginBottom: 16,
            fontSize: 12, color: C.red, textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de usuario"
            autoComplete="username"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 10,
              border: `1.5px solid ${C.border + "60"}`,
              background: C.bg, color: C.white, fontSize: 14,
              fontFamily: "inherit", outline: "none",
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contrasena"
            autoComplete="current-password"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 10,
              border: `1.5px solid ${C.border + "60"}`,
              background: C.bg, color: C.white, fontSize: 14,
              fontFamily: "inherit", outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={!nombre.trim() || !password || checking}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 10,
              border: "none", background: nombre.trim() && password ? C.blue : C.border + "40",
              color: C.white, fontSize: 14, fontWeight: 700,
              cursor: !nombre.trim() || !password || checking ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: checking ? 0.7 : 1,
              transition: "all 0.2s",
            }}
          >
            {checking ? "Validando credenciales..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
