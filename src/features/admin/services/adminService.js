import { apiFetch } from "../../../services/api";

export async function getAulas() {
  return apiFetch("/api/aulas");
}

export async function getAulaDetalle(idAula) {
  return apiFetch(`/api/aulas/${idAula}`);
}

export async function getDispositivosAula(idAula) {
  return apiFetch(`/api/aulas/${idAula}/dispositivos`);
}

export async function getSolicitudes() {
  // El API actual no expone GET /api/solicitudes
  return [];
}

export async function getLuxHistorial(idAula, limite = 50) {
  return apiFetch(`/api/aulas/${idAula}/lux?limite=${limite}`);
}

export async function getEventosAula(idAula) {
  return apiFetch(`/api/eventos?idAula=${idAula}`);
}

export async function controlarActuadorAula(idAula, tipo, action) {
  return apiFetch(`/api/admin/aulas/${idAula}/actuadores/${tipo}`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}
