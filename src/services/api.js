// Configuración compartida de API
const API_BASE = import.meta.env.VITE_API_URL || "https://luxxxxroom.ngrok.app/api";
const BASE_URL = API_BASE.replace(/\/api$/, "");

export { API_BASE };

// URL del WebSocket STOMP (Spring Boot con SockJS)
export const WS_URL =
  BASE_URL.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://") +
  "/ws/websocket";

// Cabeceras comunes para todas las peticiones
export const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

/**
 * Wrapper fetch con cabeceras comunes y manejo de errores
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...API_HEADERS, ...options.headers },
  });
  if (!res.ok) throw new Error(`Error ${res.status} en ${path}`);
  return res.json();
}

/**
 * Mapea un dispositivo a sus propiedades de estado booleanas/valores
 */
export function mapDispositivos(dispositivos = []) {
  const find = (tipo) => dispositivos.find((d) => d.tipo?.nombreTipo === tipo);

  const light = find("light");
  const blind = find("blind");
  const screen = find("screen");
  const projector = find("projector");
  const monitor = find("monitor");
  const luxSensor = find("lux_sensor");

  return {
    lux: luxSensor ? Number(luxSensor.estadoActual) || 0 : undefined,
    proyector: projector?.estadoActual === "ON",
    persianas: blind?.estadoActual === "CLOSED",
    monitor: monitor?.estadoActual === "ON",
    luces: light?.estadoActual === "ON",
    telon: screen?.estadoActual === "DEPLOYED",
  };
}
