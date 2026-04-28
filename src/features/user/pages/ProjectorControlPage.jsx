import { useState, useEffect } from "react";
import { COLORS as C } from "../constants";
import {
  SunIcon, BlindsIcon, MonitorIcon, LightbulbIcon,
  ArrowLeftIcon, MapPinIcon,
} from "../components/Icons";
import PowerButton from "../components/PowerButton";
import StatusCard from "../components/StatusCard";
import StepIndicator from "../components/StepIndicator";
import useProjector from "../hooks/useProjector";

function ProjectorControlPage({ aula, onBack }) {
  const [show, setShow] = useState(false);

  const {
    isOn, processing, lux, luxOk, error,
    persianas, pantallaOled, luces, pantalla,
    stepIndex, ringPulse, progress, steps,
    togglePower,
  } = useProjector(aula.id);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  function handlePower() {
    togglePower();
  }

  // Mapear estados de la API a labels legibles
  function estadoLabel(estado) {
    const e = (estado || "").toUpperCase();
    const map = {
      ON: "Encendido", OFF: "Apagado",
      OPEN: "Abiertas", CLOSED: "Cerradas",
      DEPLOYED: "Desplegada", RETRACTED: "Recogida",
      UNKNOWN: "Sin datos",
    };
    return map[e] || estado || "—";
  }

  function estadoColor(estado) {
    const e = (estado || "").toUpperCase();
    const activo = ["ON", "CLOSED", "DEPLOYED"];
    const inactivo = ["OFF", "OPEN", "RETRACTED"];
    if (activo.includes(e)) return C.blue;
    if (inactivo.includes(e)) return C.textSub;
    return C.orange;
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: "100vh", padding: "0 24px",
      opacity: show ? 1 : 0, transform: show ? "translateX(0)" : "translateX(30px)",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Top bar */}
      <div style={{
        width: "100%", maxWidth: 440, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "20px 0 10px",
      }}>
        <button onClick={onBack} style={{
          background: "transparent", border: `1.5px solid ${C.blue}`,
          borderRadius: 10, width: 40, height: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: C.white, fontFamily: "inherit",
        }}>
          <ArrowLeftIcon />
        </button>
        <div style={{ fontSize: 10, color: C.textSub, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
          Detalles del Aula
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Aula info */}
      <div style={{ textAlign: "center", marginTop: 10, marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: 0 }}>
          {aula.nombre}
        </h2>
        <p style={{ fontSize: 12, color: C.textSub, marginTop: 6, display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
          <MapPinIcon /> {aula.edificio || aula.ubicacion || ""}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "#f4433615", border: "1px solid #f4433640",
          borderRadius: 10, padding: "12px 16px", marginBottom: 20,
          fontSize: 12, color: "#f44336", textAlign: "center",
          maxWidth: 400, width: "100%",
        }}>
          {error}
        </div>
      )}

      {/* 4 status cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
        marginBottom: 32, width: "100%", maxWidth: 400,
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s",
      }}>
        <StatusCard
          icon={<SunIcon size={20} />}
          value={lux !== null ? lux : "—"}
          unit={lux !== null ? "lux" : ""}
          label="Luminosidad actual"
          accentColor={lux !== null ? (luxOk ? C.green : C.orange) : C.textSub}
        />
        <StatusCard
          icon={<BlindsIcon size={20} />}
          value={estadoLabel(persianas)}
          label="Persianas"
          accentColor={estadoColor(persianas)}
        />
        <StatusCard
          icon={<MonitorIcon size={20} />}
          value={estadoLabel(pantallaOled)}
          label="Monitor"
          accentColor={estadoColor(pantallaOled)}
        />
        <StatusCard
          icon={<LightbulbIcon size={20} />}
          value={estadoLabel(luces)}
          label="Luces"
          accentColor={estadoColor(luces)}
        />
      </div>

      {/* Power button */}
      <PowerButton
        isOn={isOn} processing={processing}
        progress={progress} ringPulse={ringPulse}
        onClick={handlePower} visible={show}
      />

      {/* Label */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.white }}>
          {isOn ? "Proyector encendido" : "Encender proyector"}
        </div>
        <div style={{
          fontSize: 13, marginTop: 5, fontWeight: 500,
          color: isOn ? C.green : processing ? C.blue : C.textSub,
        }}>
          {isOn ? "Encendido" : processing ? "Procesando..." : "Apagado"}
        </div>
      </div>

      {/* Steps */}
      <StepIndicator steps={steps} currentStep={stepIndex} processing={processing} isOn={isOn} />
      <div style={{ height: 40 }} />
    </div>
  );
}

export default ProjectorControlPage;
