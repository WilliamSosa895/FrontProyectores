/* eslint-disable react/prop-types */
import { COLORS as C } from "../constants";

export default function Toggle({ on, color = C.green, onClick, disabled = false }) {
  const cursor = disabled ? "default" : onClick ? "pointer" : "default";

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      style={{
        width: 38,
        height: 20,
        borderRadius: 10,
        padding: 2,
        background: on ? color : "#444",
        transition: "background 0.3s",
        display: "flex",
        alignItems: "center",
        border: "none",
        cursor,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: C.white,
          transform: on ? "translateX(18px)" : "translateX(0)",
          transition: "transform 0.3s",
        }}
      />
    </button>
  );
}
