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

export async function solicitarEncendido(idAula) {
  return apiFetch("/api/solicitudes", {
    method: "POST",
    body: JSON.stringify({ idAula }),
  });
}

export async function getSolicitud(idSolicitud) {
  return apiFetch(`/api/solicitudes/${idSolicitud}`);
}

export async function getLuxHistorial(idAula, limite = 1) {
  return apiFetch(`/api/aulas/${idAula}/lux?limite=${limite}`);
}
