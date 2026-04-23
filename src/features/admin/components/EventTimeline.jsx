import { COLORS as C } from "../constants";

export default function EventTimeline({ data, color = C.blue, height = 140, label }) {
  if (!data || data.length === 0) return null;

  const w = 100;
  const h = 60;
  const pad = 5;
  const barW = (w - pad * 2) / data.length;

  return (
    <div
      style={{
        background: C.card,
        borderRadius: 12,
        padding: 16,
        border: `1.5px solid ${C.border}`,
        flex: 1,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: C.white, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 10, color: C.textSub, marginBottom: 10 }}>
        Estado en el tiempo
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }}>
        {data.map((d, i) => (
          <rect
            key={i}
            x={pad + i * barW}
            y={d.v ? 5 : h / 2}
            width={barW - 1}
            height={d.v ? h / 2 - 5 : h / 2 - 5}
            rx="1"
            fill={d.v ? color : "#333"}
            opacity={d.v ? 0.8 : 0.4}
          />
        ))}
        <line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} stroke="#444" strokeWidth="0.3" />
        <text x={pad} y={h / 2 - 3} fontSize="4" fill={C.green}>ON</text>
        <text x={pad} y={h / 2 + 8} fontSize="4" fill={C.textSub}>OFF</text>
      </svg>
    </div>
  );
}
