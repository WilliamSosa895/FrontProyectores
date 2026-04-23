import { COLORS as C } from "../constants";

export default function StatCard({ value, label, delay = 0, visible = true }) {
  return (
    <div
      style={{
        background: C.card,
        borderRadius: 10,
        padding: "14px 12px",
        border: `1.5px solid ${C.border}`,
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.5s ease ${delay}s`,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, color: C.blue }}>{value}</div>
      <div style={{ fontSize: 10, color: C.textSub, marginTop: 2 }}>{label}</div>
    </div>
  );
}
