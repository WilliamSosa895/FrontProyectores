import { COLORS as C } from "../constants";
import { ProjectorIcon, ChevronRightIcon, MapPinIcon } from "./Icons";

export default function AulaCard({ aula, onClick, delay = 0, visible = true }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: C.card,
        border: `1.5px solid ${C.blue}`,
        borderRadius: 12,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        fontFamily: "inherit",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            border: `1.5px solid ${C.blue}40`,
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.blue,
          }}
        >
          <ProjectorIcon size={20} color={C.blue} />
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.white }}>
            {aula.nombre}
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.textSub,
              marginTop: 3,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MapPinIcon /> {aula.edificio} · {aula.piso}
          </div>
        </div>
      </div>
      <ChevronRightIcon />
    </button>
  );
}
