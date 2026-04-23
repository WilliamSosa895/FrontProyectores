const API_URL = "http://localhost:8080";

export async function getAulas() {
  const res = await fetch(`${API_URL}/api/aulas`);
  if (!res.ok) throw new Error("Error al obtener aulas — ¿backend corriendo?");
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

export async function getSolicitudes() {
  // TODO: cuando tu compañero agregue GET /api/solicitudes
  return [];
}
