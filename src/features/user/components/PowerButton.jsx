import { useState } from "react";
import { COLORS as C } from "../constants";
import { PowerIcon } from "./Icons";

const RING_SIZE = 190;
const CIRCUMFERENCE = Math.PI * (RING_SIZE - 24);

export default function PowerButton({
  isOn,
  processing,
  progress = 0,   // 0 a 1
  ringPulse,
  onClick,
  visible = true,
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        marginBottom: 28,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.8)",
        transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
      }}
    >
      {/* Glow ambiental */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: RING_SIZE + 60,
          height: RING_SIZE + 60,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: isOn
            ? `radial-gradient(circle, ${C.green}20 0%, transparent 60%)`
            : processing
            ? `radial-gradient(circle, ${C.blue}15 0%, transparent 60%)`
            : "none",
          transition: "all 0.8s ease",
          animation: ringPulse
            ? "ringPulse 1.6s ease-in-out infinite"
            : "none",
        }}
      />

      {/* Anillo de progreso */}
      <svg width={RING_SIZE} height={RING_SIZE} style={{ display: "block" }}>
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_SIZE / 2 - 12}
          fill="none"
          stroke={C.card}
          strokeWidth="2.5"
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_SIZE / 2 - 12}
          fill="none"
          stroke={isOn ? C.green : C.blue}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          style={{
            transition:
              "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease",
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
        />
      </svg>

      {/* Botón central */}
      <button
        onClick={onClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${pressed ? 0.93 : 1})`,
          width: RING_SIZE - 50,
          height: RING_SIZE - 50,
          borderRadius: "50%",
          border: `2px solid ${isOn ? C.green : C.blue}`,
          background: C.card,
          color: isOn ? C.green : C.blue,
          cursor: processing ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isOn
            ? `0 0 40px ${C.green}25, 0 0 80px ${C.green}10`
            : "none",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          fontFamily: "inherit",
        }}
      >
        <PowerIcon size={44} color={isOn ? C.green : C.blue} />
      </button>
    </div>
  );
}
