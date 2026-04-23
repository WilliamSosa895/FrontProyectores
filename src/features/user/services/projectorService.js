// Todas las llamadas a la API real del backend
// No emula nada — si el backend está apagado, lanza error

const API_URL = "http://localhost:8080";

export async function getAulas() {
  const res = await fetch(`${API_URL}/api/aulas`);
  if (!res.ok) throw new Error("Error al obtener aulas — ¿está corriendo el backend?");
  return res.json();
}

export async function getAulaDetalle(idAula) {
  const res = await fetch(`${API_URL}/api/aulas/${idAula}`);
  if (!res.ok) throw new Error("Error al obtener detalle del aula");
  return res.json();
}

export async function getDispositivosAula(idAula) {
  const res = await fetch(`${API_URL}/api/aulas/${idAula}/dispositivos`);
  if (!res.ok) throw new Error("Error al obtener dispositivos");
  return res.json();
}

export async function solicitarEncendido(idAula, idUsuario) {
  const res = await fetch(`${API_URL}/api/solicitudes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idAula, idUsuario }),
  });
  if (!res.ok) throw new Error("Error al enviar solicitud");
  return res.json();
}

export async function getSolicitud(idSolicitud) {
  const res = await fetch(`${API_URL}/api/solicitudes/${idSolicitud}`);
  if (!res.ok) throw new Error("Error al consultar solicitud");
  return res.json();
}
