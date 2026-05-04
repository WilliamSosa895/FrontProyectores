// Configuracion compartida de API.
// VITE_API_URL debe apuntar al host base, por ejemplo: http://localhost:8080
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
const BASE_URL = API_ORIGIN;
const TOKEN_STORAGE_KEY = "authToken";

export { API_ORIGIN };

// URL del WebSocket STOMP (Spring Boot con SockJS)
export const WS_URL =
  BASE_URL.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://") +
  "/ws/websocket";

// Cabeceras comunes para todas las peticiones
export const API_HEADERS = {
  "Content-Type": "application/json",
};

export function getStoredToken() {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  if (token) sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  else sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Wrapper fetch con cabeceras comunes y manejo de errores
 */
export async function apiFetch(path, options = {}) {
  const { auth = true, ...rest } = options;
  const token = auth ? getStoredToken() : null;
  const method = (rest.method || "GET").toUpperCase();

  const headers = {
    ...API_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers || {}),
  };

  const requestOptions = {
    ...rest,
    headers,
  };

  if (method === "GET" && requestOptions.cache === undefined) {
    requestOptions.cache = "no-store";
  }

  const res = await fetch(`${API_ORIGIN}${path}`, {
    ...requestOptions,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (isJson && payload?.error) ||
      (typeof payload === "string" && payload) ||
      `Error ${res.status} en ${path}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return payload;
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
