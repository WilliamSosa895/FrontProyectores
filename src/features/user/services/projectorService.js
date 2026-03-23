// Base URL del backend (configurar según ambiente)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Obtener lista de aulas disponibles
 */
export async function getAulas() {
  const res = await fetch(`${API_BASE}/aulas`);
  if (!res.ok) throw new Error("Error al obtener aulas");
  return res.json();
}

/**
 * Obtener detalle de un aula específica (lux, persianas, pantalla, proyector)
 */
export async function getAulaDetalle(idAula) {
  const res = await fetch(`${API_BASE}/aulas/${idAula}`);
  if (!res.ok) throw new Error("Error al obtener detalle del aula");
  return res.json();
}

/**
 * Enviar solicitud para encender el proyector de un aula
 */
export async function solicitarEncendido(idAula, idUsuario) {
  const res = await fetch(`${API_BASE}/solicitudes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_aula: idAula, id_usuario: idUsuario }),
  });
  if (!res.ok) throw new Error("Error al enviar solicitud");
  return res.json();
}

/**
 * Enviar solicitud para apagar el proyector de un aula
 */
export async function solicitarApagado(idAula, idUsuario) {
  const res = await fetch(`${API_BASE}/solicitudes/apagar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_aula: idAula, id_usuario: idUsuario }),
  });
  if (!res.ok) throw new Error("Error al apagar proyector");
  return res.json();
}

/**
 * Obtener historial de solicitudes del usuario
 */
export async function getSolicitudesUsuario(idUsuario) {
  const res = await fetch(`${API_BASE}/solicitudes/usuario/${idUsuario}`);
  if (!res.ok) throw new Error("Error al obtener solicitudes");
  return res.json();
}
