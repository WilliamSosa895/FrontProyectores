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

export async function solicitarEncendido(idAula, idUsuario) {
  return apiFetch("/api/solicitudes", {
    method: "POST",
    body: JSON.stringify({ idAula, idUsuario }),
  });
}

export async function getSolicitud(idSolicitud) {
  return apiFetch(`/api/solicitudes/${idSolicitud}`);
}
