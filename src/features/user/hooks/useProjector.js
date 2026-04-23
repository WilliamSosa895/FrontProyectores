import { useState, useCallback, useEffect, useRef } from "react";
import { solicitarEncendido, getSolicitud, getDispositivosAula } from "../services/projectorService";

const ALL_STEPS = [
  { label: "Solicitud enviada", detail: "Procesando..." },
  { label: "Verificando luminosidad", detail: "Leyendo sensor" },
  { label: "Apagando luces", detail: "Reduciendo luz artificial" },
  { label: "Cerrando persianas", detail: "Reduciendo luz natural" },
  { label: "Desplegando pantalla", detail: "Pantalla en posición" },
  { label: "Encendiendo proyector", detail: "Casi listo..." },
  { label: "Proyector encendido", detail: "Listo para usar" },
];

const STEPS_MAP = {
  "PROCESANDO":            { index: 0 },
  "VERIFICANDO_LUX":       { index: 1 },
  "APAGANDO_LUCES":        { index: 2 },
  "CERRANDO_PERSIANAS":    { index: 3 },
  "BAJANDO_PANTALLA":      { index: 4 },
  "ENCENDIENDO_PROYECTOR": { index: 5 },
  "COMPLETADA":            { index: 6 },
  "ERROR":                 { index: -1 },
};

export default function useProjector(idAula) {
  const [isOn, setIsOn] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [dispositivos, setDispositivos] = useState({});
  const [lux, setLux] = useState(null);
  const [solicitudId, setSolicitudId] = useState(null);
  const pollRef = useRef(null);

  const steps = ALL_STEPS;
  const luxOk = lux !== null && lux <= 100;
  const progress = isOn ? 1 : stepIndex >= 0 ? (stepIndex + 1) / steps.length : 0;
  const ringPulse = processing;

  // Cargar dispositivos del aula
  const cargarDispositivos = useCallback(async () => {
    if (!idAula) return;
    try {
      const data = await getDispositivosAula(idAula);
      const map = {};
      if (Array.isArray(data)) {
        data.forEach((d) => {
          // La API devuelve: d.tipo.nombreTipo = "lux_sensor", "light", etc.
          const tipo = d.tipo?.nombreTipo || "";
          const estado = d.estadoActual || "UNKNOWN";
          map[tipo] = estado;
        });
      }
      setDispositivos(map);

      // Detectar si el proyector está encendido
      if (map["projector"] === "ON") {
        setIsOn(true);
      } else if (map["projector"] === "OFF") {
        setIsOn(false);
      }

      // Detectar lux (si es un número)
      const luxVal = map["lux_sensor"];
      if (luxVal && !isNaN(luxVal)) {
        setLux(parseInt(luxVal));
      } else if (luxVal === "UNKNOWN") {
        setLux(null);
      }
    } catch (err) {
      setError("No se pueden cargar los dispositivos — ¿backend corriendo?");
    }
  }, [idAula]);

  useEffect(() => {
    cargarDispositivos();
    const interval = setInterval(cargarDispositivos, 3000);
    return () => clearInterval(interval);
  }, [cargarDispositivos]);

  // Poll de solicitud activa
  useEffect(() => {
    if (!solicitudId || !processing) return;

    pollRef.current = setInterval(async () => {
      try {
        const sol = await getSolicitud(solicitudId);
        const estado = (sol.estado || "").toUpperCase();

        const mapped = STEPS_MAP[estado];
        if (mapped) {
          setStepIndex(mapped.index);
        }

        if (estado === "COMPLETADA") {
          setIsOn(true);
          setProcessing(false);
          setSolicitudId(null);
          clearInterval(pollRef.current);
          cargarDispositivos();
        } else if (estado === "ERROR") {
          setError(sol.detalle || "Error en el proceso");
          setProcessing(false);
          setSolicitudId(null);
          clearInterval(pollRef.current);
        }
      } catch (err) {
        // Si no puede consultar, sigue intentando
      }
    }, 2000);

    return () => clearInterval(pollRef.current);
  }, [solicitudId, processing, cargarDispositivos]);

  const encender = useCallback(async (idUsuario) => {
    if (processing || isOn || !idAula) return;
    setProcessing(true);
    setError(null);
    setStepIndex(0);

    try {
      const res = await solicitarEncendido(idAula, idUsuario);
      setSolicitudId(res.idSolicitud || res.id);
    } catch (err) {
      setError(err.message);
      setProcessing(false);
      setStepIndex(-1);
    }
  }, [processing, isOn, idAula]);

  const apagar = useCallback(async () => {
    setError("Función de apagado no implementada en el API aún");
  }, []);

  const togglePower = useCallback((idUsuario) => {
    if (isOn) apagar();
    else encender(idUsuario);
  }, [isOn, encender, apagar]);

  // Estados legibles desde el mapa
  const persianas = dispositivos["blind"] || "desconocido";
  const pantallaOled = dispositivos["monitor"] || "desconocido";
  const luces = dispositivos["light"] || "desconocido";
  const pantalla = dispositivos["screen"] || "desconocido";

  return {
    isOn, processing, lux, luxOk, error,
    persianas, pantallaOled, luces, pantalla, dispositivos,
    stepIndex, ringPulse, progress, steps,
    encender, apagar, togglePower,
    cargarDispositivos,
  };
}
