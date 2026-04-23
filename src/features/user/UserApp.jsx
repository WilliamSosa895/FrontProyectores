import { useState } from "react";
import { COLORS as C } from "./constants";
import AulaSelectPage from "./pages/AulaSelectPage";
import ProjectorControlPage from "./pages/ProjectorControlPage";
import { useAuth } from "../../context/AuthContext";

function UserApp() {
  const [selectedAula, setSelectedAula] = useState(null);
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: "'Outfit', system-ui, -apple-system, sans-serif", color: C.textMain,
    }}>
      {/* Logout bar */}
      <div style={{
        position: "fixed", top: 10, right: 16, zIndex: 200,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        {user && (
          <span style={{ fontSize: 11, color: C.textSub }}>{user.nombre}</span>
        )}
        <button onClick={logout} style={{
          background: "transparent", border: `1px solid #f4433660`,
          borderRadius: 6, padding: "4px 10px", color: "#f44336", fontSize: 10,
          fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>Salir</button>
      </div>

      {selectedAula ? (
        <ProjectorControlPage aula={selectedAula} onBack={() => setSelectedAula(null)} />
      ) : (
        <AulaSelectPage onSelect={setSelectedAula} />
      )}
    </div>
  );
}

export default UserApp;
