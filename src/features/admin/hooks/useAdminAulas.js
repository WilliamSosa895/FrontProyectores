import { useState, useEffect, useCallback } from "react";
import { getAulas, getDispositivosAula } from "../services/adminService";

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

      for (const a of aulasData) {
        const id = a.idAula || a.id;
        let dispositivos = {};

        try {
          const devs = await getDispositivosAula(id);
          if (Array.isArray(devs)) {
            devs.forEach((d) => {
              // La API devuelve: d.tipo.nombreTipo = "lux_sensor", "light", etc.
              const tipo = d.tipo?.nombreTipo || "";
              const estado = (d.estadoActual || "UNKNOWN").toUpperCase();
              dispositivos[tipo] = estado;
            });
          }
        } catch (e) {
          // Si falla un aula, sigue con las demás
        }

        const luxVal = dispositivos["lux_sensor"];
        if (luxVal && !isNaN(luxVal)) {
          luxMap[id] = parseInt(luxVal);
        }

        normalized.push({
          id,
          nombre: a.nombre || a.ubicacion || `Aula ${id}`,
          ubicacion: a.ubicacion || "",
          estado: a.estado || "disponible",
          lux: luxMap[id] || 0,
          proyector: dispositivos["projector"] === "ON",
          persianas: dispositivos["blind"] === "CLOSED",
          monitor: dispositivos["monitor"] === "ON",
          luces: dispositivos["light"] === "ON",
          telon: dispositivos["screen"] === "DEPLOYED",
        });
      }

      setAulas(normalized);
      setLuxValues(luxMap);
      setError(null);
    } catch (err) {
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
    aulas, luxValues, activas, proyectoresOn,
    totalAulas: aulas.length, error, loading,
  };
}

export function genLuxHistory() { return []; }
export function genEventHistory() { return []; }
export function genSolicitudes() { return []; }
