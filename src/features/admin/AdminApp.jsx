import { useState } from "react";
import { COLORS as C } from "./constants";
import { ProjectorIcon, UserIcon } from "./components/Icons";
import useAdminAulas from "./hooks/useAdminAulas";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AulaDetailPage from "./pages/AulaDetailPage";
import HistoricalPage from "./pages/HistoricalPage";
import { useAuth } from "../../context/AuthContext";

function AdminApp() {
  const [screen, setScreen] = useState("dashboard");
  const [selectedAula, setSelectedAula] = useState(null);
  const { user, logout } = useAuth();

  const { aulas, luxValues, activas, proyectoresOn, error } = useAdminAulas();

  function goToDashboard() { setScreen("dashboard"); setSelectedAula(null); }
  function goToDetail(aula) { setSelectedAula(aula); setScreen("detail"); }
  function goToHistorical() { setScreen("historical"); setSelectedAula(null); }

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: "'Outfit', system-ui, -apple-system, sans-serif", color: C.textMain,
    }}>
      {/* Top bar */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.border}40`,
        padding: "12px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${C.blue}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ProjectorIcon size={14} color={C.blue} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>
            <span style={{ color: C.blue }}>Lux</span>Room
            <span style={{ fontSize: 10, color: C.textSub, marginLeft: 6 }}>Admin</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={goToDashboard} style={{
            background: screen === "dashboard" || screen === "detail" ? C.blue + "25" : "transparent",
            border: `1px solid ${screen === "dashboard" || screen === "detail" ? C.blue : "transparent"}`,
            borderRadius: 6, padding: "5px 12px", color: C.white, fontSize: 11,
            fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Aulas</button>
          <button onClick={goToHistorical} style={{
            background: screen === "historical" ? C.blue + "25" : "transparent",
            border: `1px solid ${screen === "historical" ? C.blue : "transparent"}`,
            borderRadius: 6, padding: "5px 12px", color: C.white, fontSize: 11,
            fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Historial</button>
          <button onClick={logout} style={{
            background: "transparent", border: `1px solid #f4433660`,
            borderRadius: 6, padding: "5px 12px", color: "#f44336", fontSize: 11,
            fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Salir</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 40px", maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 20 }}>
          <span style={{ color: C.blue }}>Lux</span>Room
          {user && <span style={{ fontSize: 12, color: C.textSub, marginLeft: 10 }}>{user.nombre}</span>}
        </h1>

        {screen === "dashboard" && (
          <AdminDashboardPage
            aulas={aulas} luxValues={luxValues} activas={activas}
            proyectoresOn={proyectoresOn} error={error}
            onSelectAula={goToDetail} onGoHistorical={goToHistorical}
          />
        )}
        {screen === "detail" && selectedAula && (
          <AulaDetailPage aula={selectedAula} luxValue={luxValues[selectedAula.id]} onBack={goToDashboard} />
        )}
        {screen === "historical" && (
          <HistoricalPage aulas={aulas} onBack={goToDashboard} />
        )}
      </div>
    </div>
  );
}

export default AdminApp;
