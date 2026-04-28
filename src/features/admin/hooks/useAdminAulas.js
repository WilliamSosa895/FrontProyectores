import { useState, useEffect, useCallback } from "react";
import { getAulas, getDispositivosAula, getLuxHistorial } from "../services/adminService";

export default function useAdminAulas() {
  const [aulas, setAulas] = useState([]);
  const [luxValues, setLuxValues] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const aulasData = await getAulas();
      const normalized = [];
      const luxMap = {};

      for (const aula of aulasData) {
        const id = aula.idAula || aula.id;
        const dispositivos = {};

        const [devsResult, luxResult] = await Promise.allSettled([
          getDispositivosAula(id),
          getLuxHistorial(id, 1),
        ]);

        if (devsResult.status === "fulfilled" && Array.isArray(devsResult.value)) {
          devsResult.value.forEach((dispositivo) => {
            const tipo = dispositivo.tipo?.nombreTipo || "";
            const estado = (dispositivo.estadoActual || "UNKNOWN").toUpperCase();
            dispositivos[tipo] = estado;
          });
        }

        if (luxResult.status === "fulfilled" && Array.isArray(luxResult.value)) {
          const ultimaLectura = luxResult.value[0] || null;
          const luxActual = Number(ultimaLectura?.valorLux);
          if (!Number.isNaN(luxActual)) {
            luxMap[id] = luxActual;
          }
        }

        const getDeviceState = (tipo, fallback) => {
          const value = (dispositivos[tipo] || "UNKNOWN").toUpperCase();
          return value === "UNKNOWN" || value === "OFFLINE" ? fallback : value;
        };

        normalized.push({
          id,
          nombre: aula.nombre || aula.ubicacion || `Aula ${id}`,
          ubicacion: aula.ubicacion || "",
          estado: aula.estado || "disponible",
          lux: luxMap[id] ?? 0,
          proyector: getDeviceState("projector", "OFF") === "ON",
          persianas: getDeviceState("blind", "OPEN") === "CLOSED",
          monitor: getDeviceState("monitor", "OFF") === "ON",
          luces: getDeviceState("light", "ON") === "ON",
          telon: getDeviceState("screen", "RETRACTED") === "DEPLOYED",
        });
      }

      setAulas(normalized);
      setLuxValues(luxMap);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se puede conectar al servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const activas = aulas.filter((a) => a.estado !== "mantenimiento").length;
  const proyectoresOn = aulas.filter((a) => a.proyector).length;

  return {
    aulas,
    luxValues,
    activas,
    proyectoresOn,
    totalAulas: aulas.length,
    error,
    loading,
  };
}

export function genLuxHistory() { return []; }
export function genEventHistory() { return []; }
export function genSolicitudes() { return []; }


