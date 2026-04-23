import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const C = {
  bg: "#1a1a1e", card: "#2a2a2f", border: "#2196F3",
  blue: "#2196F3", white: "#ffffff", textSub: "#9e9e9e",
  red: "#f44336", green: "#4caf50",
};

function LoginPage() {
  const { login, apiFetch } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    setChecking(true);
    setError("");
    try {
      const data = await apiFetch("/api/usuarios");
      const normalizados = (Array.isArray(data) ? data : []).map((u) => ({
        idUsuario: u.idUsuario,
        nombre: u.nombre,
        rol: u.rol?.nombreRol || "Docente",
      }));
      setUsuarios(normalizados);
    } catch (err) {
      setError("No se puede conectar al servidor. Verifica que el backend este corriendo.");
      setUsuarios([]);
    } finally {
      setChecking(false);
    }
  }

  async function handleLogin() {
    if (!selected) return;
    setError("");
    setChecking(true);

    try {
      // Verificar backend y autenticacion local por seleccion de usuario
      await apiFetch("/api/aulas");
      login(selected.nombre, selected.rol, selected.idUsuario);
    } catch (err) {
      setError("No se puede conectar al servidor. Verifica que el backend esté corriendo.");
    } finally {
      setChecking(false);
    }
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
            Selecciona tu usuario para continuar
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
            <button onClick={cargarUsuarios} style={{
              display: "block", margin: "10px auto 0", padding: "6px 14px",
              borderRadius: 6, border: `1px solid ${C.blue}`, background: "transparent",
              color: C.blue, fontSize: 11, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
            }}>
              Reintentar
            </button>
          </div>
        )}

        {/* User list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {usuarios.map((u) => (
            <button
              key={u.idUsuario}
              onClick={() => setSelected(u)}
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 10,
                border: `1.5px solid ${selected?.idUsuario === u.idUsuario ? C.blue : C.border + "40"}`,
                background: selected?.idUsuario === u.idUsuario ? C.blue + "15" : C.bg,
                color: C.white, fontSize: 14, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "all 0.2s ease",
              }}
            >
              <span>{u.nombre}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                background: u.rol === "Administrador" ? C.blue + "25" : C.green + "25",
                color: u.rol === "Administrador" ? C.blue : C.green,
              }}>
                {u.rol === "Administrador" ? "ADMIN" : "DOCENTE"}
              </span>
            </button>
          ))}

          {!checking && usuarios.length === 0 && !error && (
            <div style={{ fontSize: 12, color: C.textSub, textAlign: "center", padding: "8px 0" }}>
              No hay usuarios activos disponibles
            </div>
          )}
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={!selected || checking}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 10,
            border: "none", background: selected ? C.blue : C.border + "40",
            color: C.white, fontSize: 14, fontWeight: 700,
            cursor: !selected || checking ? "not-allowed" : "pointer",
            fontFamily: "inherit", opacity: checking ? 0.7 : 1,
            transition: "all 0.2s",
          }}
        >
          {checking ? "Conectando al servidor..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
