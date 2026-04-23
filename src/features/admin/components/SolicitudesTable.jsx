import { COLORS as C } from "../constants";
import { UserIcon, ClockIcon } from "./Icons";

export default function SolicitudesTable({ solicitudes }) {
  if (!solicitudes || solicitudes.length === 0) return null;

  return (
    <div
      style={{
        background: C.card,
        borderRadius: 12,
        border: `1.5px solid ${C.border}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          fontSize: 13,
          fontWeight: 700,
          color: C.white,
          borderBottom: `1px solid ${C.border}40`,
        }}
      >
        Solicitudes realizadas
      </div>
      {solicitudes.map((s, i) => (
        <div
          key={s.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom:
              i < solicitudes.length - 1 ? "1px solid #333" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: C.blue + "15",
                border: `1px solid ${C.blue}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.blue,
              }}
            >
              <UserIcon size={13} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.white }}>
                {s.usuario}
              </div>
              <div style={{ fontSize: 10, color: C.textSub }}>{s.accion}</div>
            </div>
          </div>
          <div
            style={{
              fontSize: 10,
              color: C.textSub,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ClockIcon /> {s.hora}
          </div>
        </div>
      ))}
    </div>
  );
}
