import { useState, useCallback } from "react";

// Pasos del flujo de activación
const STEPS = [
  { label: "Verificando luminosidad", detail: "" },
  { label: "Cerrando persianas", detail: "Reduciendo luz ambiental" },
  { label: "Luminosidad óptima", detail: "Nivel adecuado alcanzado" },
  { label: "Desplegando pantalla", detail: "Pantalla en posición" },
  { label: "Proyector encendido", detail: "Listo para usar" },
];

const INITIAL_LUX = 210;
const TARGET_LUX = 75;
const TOTAL_STEPS = STEPS.length;

export default function useProjector() {
  const [isOn, setIsOn] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lux, setLux] = useState(INITIAL_LUX);
  const [persianas, setPersianas] = useState("abiertas");
  const [pantalla, setPantalla] = useState("arriba");
  const [stepIndex, setStepIndex] = useState(-1);
  const [ringPulse, setRingPulse] = useState(false);

  // Progreso del anillo (0 a 1)
  const progress = isOn
    ? 1
    : stepIndex >= 0
    ? (stepIndex + 1) / TOTAL_STEPS
    : 0;

  // Steps con detalle dinámico del lux
  const steps = STEPS.map((s, i) =>
    i === 0 ? { ...s, detail: `${lux} lux detectados` } : s
  );

  const luxOk = lux <= 100;

  const encender = useCallback(() => {
    if (processing || isOn) return;
    setProcessing(true);
    setRingPulse(true);
    setStepIndex(0);

    // TODO: Reemplazar timeouts con llamadas reales al backend/MQTT
    setTimeout(() => {
      setStepIndex(1);
      setPersianas("cerrando");
    }, 1400);

    setTimeout(() => {
      setLux(TARGET_LUX);
      setPersianas("cerradas");
      setStepIndex(2);
    }, 3200);

    setTimeout(() => {
      setPantalla("abajo");
      setStepIndex(3);
    }, 4400);

    setTimeout(() => {
      setIsOn(true);
      setStepIndex(4);
      setProcessing(false);
      setRingPulse(false);
    }, 5600);
  }, [processing, isOn]);

  const apagar = useCallback(() => {
    if (processing || !isOn) return;
    setProcessing(true);
    setRingPulse(true);

    // TODO: Reemplazar con llamada real al backend
    setTimeout(() => {
      setIsOn(false);
      setLux(INITIAL_LUX);
      setPersianas("abiertas");
      setPantalla("arriba");
      setStepIndex(-1);
      setProcessing(false);
      setRingPulse(false);
    }, 1200);
  }, [processing, isOn]);

  const togglePower = useCallback(() => {
    if (isOn) {
      apagar();
    } else {
      encender();
    }
  }, [isOn, encender, apagar]);

  return {
    // Estado
    isOn,
    processing,
    lux,
    luxOk,
    persianas,
    pantalla,
    stepIndex,
    ringPulse,
    progress,
    steps,
    // Acciones
    encender,
    apagar,
    togglePower,
  };
}
