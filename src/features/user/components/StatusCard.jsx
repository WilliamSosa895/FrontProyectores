import { COLORS as C } from "../constants";

export default function StatusCard({ icon, value, unit, label, accentColor }) {
  return (
    <div
      style={{
        flex: 1,
        background: C.card,
        borderRadius: 12,
        padding: "18px 16px",
        border: `1.5px solid ${C.blue}`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          margin: "0 auto 10px",
          border: `1px solid ${accentColor}50`,
          background: "transparent",
          color: accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.5s ease",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: unit ? 22 : 15,
          fontWeight: 700,
          color: unit ? accentColor : C.white,
          transition: "color 0.5s ease",
        }}
      >
        {value}{" "}
        {unit && (
          <span style={{ fontSize: 11, fontWeight: 500, color: C.textSub }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontSize: 10, color: C.textSub, marginTop: 3 }}>
        {label}
      </div>
    </div>
  );
}
