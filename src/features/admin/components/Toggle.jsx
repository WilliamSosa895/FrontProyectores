import { COLORS as C } from "../constants";

export default function Toggle({ on, color = C.green }) {
  return (
    <div
      style={{
        width: 38,
        height: 20,
        borderRadius: 10,
        padding: 2,
        background: on ? color : "#444",
        transition: "background 0.3s",
        display: "flex",
        alignItems: "center",
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
    </div>
  );
}
