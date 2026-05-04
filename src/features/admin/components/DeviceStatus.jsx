/* eslint-disable react/prop-types */
import { COLORS as C } from "../constants";
import Toggle from "./Toggle";

export default function DeviceStatus({ icon, label, on, color = C.blue, onToggle, disabled = false }) {
  return (
    <div
      style={{
        background: C.card,
        borderRadius: 10,
        padding: "14px 16px",
        border: `1.5px solid ${C.border}`,
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: on ? color : C.textSub,
          }}
        >
          {icon}
          <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>
            {label}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: on ? C.green : C.textSub,
            fontWeight: 600,
          }}
        >
          {on ? "Encendido" : "Apagado"}
        </span>
        <Toggle on={on} color={color} onClick={onToggle} disabled={disabled} />
      </div>
    </div>
  );
}
