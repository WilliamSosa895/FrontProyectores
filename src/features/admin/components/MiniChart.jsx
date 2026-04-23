import { COLORS as C } from "../constants";

export default function MiniChart({ data, color = C.blue, height = 140, label, unit = "" }) {
  if (!data || data.length === 0) return null;

  const maxV = Math.max(...data.map((d) => d.v)) || 1;
  const minV = Math.min(...data.map((d) => d.v));
  const w = 100;
  const h = 100;
  const pad = 5;

  const points = data
    .map((d, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = h - pad - ((d.v - minV) / (maxV - minV || 1)) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const lastIdx = data.length - 1;
  const lastX = pad + (lastIdx / (data.length - 1)) * (w - pad * 2);
  const areaPoints =
    points + ` ${lastX},${h - pad} ${pad},${h - pad}`;

  // Último punto
  const last = data[lastIdx];
  const dotX = lastX;
  const dotY =
    h - pad - ((last.v - minV) / (maxV - minV || 1)) * (h - pad * 2);

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
        Últimas {data.length} lecturas
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1={pad}
            y1={pad + p * (h - pad * 2)}
            x2={w - pad}
            y2={pad + p * (h - pad * 2)}
            stroke="#333"
            strokeWidth="0.3"
          />
        ))}
        {/* Area */}
        <polygon points={areaPoints} fill={color + "15"} />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dot */}
        <circle cx={dotX} cy={dotY} r="2.5" fill={color} />
        {/* Labels */}
        <text x={pad} y={pad + 3} fontSize="4" fill={C.textSub}>
          {maxV}
          {unit}
        </text>
        <text x={pad} y={h - pad + 5} fontSize="4" fill={C.textSub}>
          {minV}
          {unit}
        </text>
      </svg>
    </div>
  );
}
