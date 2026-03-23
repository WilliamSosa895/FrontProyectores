import { useState, useEffect } from "react";
import { COLORS as C } from "../constants";
import { SunIcon, BlindsIcon, ArrowLeftIcon, MapPinIcon } from "../components/Icons";
import PowerButton from "../components/PowerButton";
import StatusCard from "../components/StatusCard";
import StepIndicator from "../components/StepIndicator";
import useProjector from "../hooks/useProjector";

export default function ProjectorControlPage({ aula, onBack }) {
  const [show, setShow] = useState(false);

  const {
    isOn,
    processing,
    lux,
    luxOk,
    persianas,
    stepIndex,
    ringPulse,
    progress,
    steps,
    togglePower,
  } = useProjector();

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  const persianasLabel =
    persianas === "abiertas"
      ? "Abiertas"
      : persianas === "cerrando"
      ? "Cerrando..."
      : "Cerradas";

  const persianasColor =
    persianas === "cerrando"
      ? C.orange
      : persianas === "cerradas"
      ? C.blue
      : C.textSub;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "0 24px",
        opacity: show ? 1 : 0,
        transform: show ? "translateX(0)" : "translateX(30px)",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Barra superior */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0 10px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: `1.5px solid ${C.blue}`,
            borderRadius: 10,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: C.white,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeftIcon />
        </button>
        <div
          style={{
            fontSize: 10,
            color: C.textSub,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Detalles del Aula
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Info del aula */}
      <div
        style={{
          textAlign: "center",
          marginTop: 10,
          marginBottom: 30,
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: C.white,
            margin: 0,
          }}
        >
          {aula.nombre}
        </h2>
        <p
          style={{
            fontSize: 12,
            color: C.textSub,
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 5,
            justifyContent: "center",
          }}
        >
          <MapPinIcon /> {aula.edificio} · {aula.piso}
        </p>
      </div>

      {/* Tarjetas de estado */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 38,
          width: "100%",
          maxWidth: 400,
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s",
        }}
      >
        <StatusCard
          icon={<SunIcon size={20} />}
          value={lux}
          unit="lux"
          label="Luminosidad actual"
          accentColor={luxOk ? C.green : C.orange}
        />
        <StatusCard
          icon={<BlindsIcon size={20} />}
          value={persianasLabel}
          label="Persianas"
          accentColor={persianasColor}
        />
      </div>

      {/* Botón de encendido */}
      <PowerButton
        isOn={isOn}
        processing={processing}
        progress={progress}
        ringPulse={ringPulse}
        onClick={togglePower}
        visible={show}
      />

      {/* Etiqueta del estado */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 36,
          opacity: show ? 1 : 0,
          transition: "all 0.6s ease 0.25s",
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 700, color: C.white }}>
          {isOn ? "Apagar proyector" : "Encender proyector"}
        </div>
        <div
          style={{
            fontSize: 13,
            marginTop: 5,
            fontWeight: 500,
            color: isOn ? C.green : processing ? C.blue : C.textSub,
            transition: "color 0.4s ease",
          }}
        >
          {isOn ? "Encendido" : processing ? "Procesando..." : "Apagado"}
        </div>
      </div>

      {/* Indicador de pasos */}
      <StepIndicator
        steps={steps}
        currentStep={stepIndex}
        processing={processing}
        isOn={isOn}
      />

      <div style={{ height: 40 }} />
    </div>
  );
}
