import { COLORS as C } from "../constants";

export default function AulaListItem({ aula, luxValue, onClick, delay = 0, visible = true }) {
  const currentLux = luxValue || aula.lux;

  return (
    <div
      onClick={onClick}
      style={{
        background: C.card,
        borderRadius: 12,
        padding: "16px 18px",
        border: `1.5px solid ${C.border}`,
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.5s ease ${delay}s`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>
            {aula.nombre}
          </div>
          <div style={{ fontSize: 11, color: C.textSub }}>
            Estado: {aula.estado === "activa" ? "Activa" : "Inactiva"}
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: 6,
            background: aula.estado === "activa" ? C.green + "20" : "#44444440",
            color: aula.estado === "activa" ? C.green : C.textSub,
            border: `1px solid ${aula.estado === "activa" ? C.green + "40" : "#444"}`,
          }}
        >
          {aula.proyector ? "En sesión" : "Sin actividad"}
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 6,
            background: currentLux <= 100 ? C.green + "25" : C.orange + "25",
            color: currentLux <= 100 ? C.green : C.orange,
          }}
        >
          {currentLux} Lux
        </span>
        <span
          style={{
            fontSize: 11,
            padding: "3px 10px",
            borderRadius: 6,
            background: "#44444440",
            color: C.textSub,
          }}
        >
          {aula.proyector
            ? "Proyector ON"
            : aula.persianas
            ? "Persianas cerradas"
            : "Sin actividad"}
        </span>
      </div>
    </div>
  );
}
