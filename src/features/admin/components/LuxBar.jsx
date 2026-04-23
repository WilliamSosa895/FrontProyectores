import { COLORS as C } from "../constants";

export default function LuxBar({ value, max = 300 }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value <= 100 ? C.green : value <= 200 ? C.orange : C.red;
  const label = value <= 100 ? "Óptimo" : value <= 200 ? "Alto" : "Muy alto";

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.textSub }}>Luminosidad Actual:</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "1px 8px",
            borderRadius: 6,
            background: color + "20",
            color: color,
          }}
        >
          {label}
        </span>
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, color: C.green, marginBottom: 8 }}>
        {value} Lux
      </div>

      <div
        style={{
          width: "100%",
          height: 10,
          background: "#333",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 5,
            background: `linear-gradient(90deg, ${C.green}, ${pct > 50 ? C.orange : C.green})`,
            transition: "width 1s ease",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
          fontSize: 10,
          color: C.textSub,
        }}
      >
        <span>0</span>
        <span style={{ color: C.green }}>100 Lux</span>
        <span>200+</span>
      </div>
    </div>
  );
}
