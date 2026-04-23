import { useState, useEffect } from "react";
import { COLORS as C } from "../constants";
import { ChartIcon, ChevronRightIcon } from "../components/Icons";
import StatCard from "../components/StatCard";
import AulaListItem from "../components/AulaListItem";

function AdminDashboardPage({
  aulas, luxValues, activas, proyectoresOn,
  onSelectAula, onGoHistorical, error,
}) {
  const [show, setShow] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);

  return (
    <div style={{
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(12px)",
      transition: "all 0.5s ease",
    }}>
      {/* Error */}
      {error && (
        <div style={{
          background: "#f4433615", border: "1px solid #f4433640",
          borderRadius: 10, padding: "14px 18px", marginBottom: 20,
          fontSize: 13, color: "#f44336", textAlign: "center",
        }}>
          {error} — ¿está corriendo el backend?
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
        <StatCard value={activas} label="Aulas Activas" delay={0} visible={show} />
        <StatCard value={aulas.length} label="Total Aulas" delay={0.08} visible={show} />
        <StatCard value={proyectoresOn} label="Proyectores ON" delay={0.16} visible={show} />
      </div>

      {/* Botón historial */}
      <button onClick={onGoHistorical} style={{
        width: "100%", background: C.card, border: `1.5px solid ${C.border}`,
        borderRadius: 10, padding: "14px 18px", marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", fontFamily: "inherit",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.blue }}>
          <ChartIcon size={18} color={C.blue} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>Datos Históricos</span>
        </div>
        <ChevronRightIcon />
      </button>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 14 }}>Mis aulas</h2>

      {aulas.length === 0 && !error && (
        <p style={{ color: C.textSub, fontSize: 14, textAlign: "center" }}>
          Cargando aulas...
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {aulas.map((aula, i) => (
          <AulaListItem
            key={aula.id}
            aula={aula}
            luxValue={luxValues[aula.id]}
            onClick={() => onSelectAula(aula)}
            delay={0.15 + i * 0.07}
            visible={show}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
