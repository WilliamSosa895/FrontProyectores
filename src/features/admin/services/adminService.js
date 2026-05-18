import { apiFetch } from "../../../services/api";

export async function getAulas() {
  return apiFetch("/api/aulas");
}

export async function getUsuarios() {
  return apiFetch("/api/usuarios/todos");
}

export async function getRoles() {
  return apiFetch("/api/usuarios/roles");
}

export async function crearUsuario(payload) {
  return apiFetch("/api/usuarios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function actualizarUsuario(idUsuario, payload) {
  return apiFetch(`/api/usuarios/${idUsuario}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function desactivarUsuario(idUsuario) {
  return apiFetch(`/api/usuarios/${idUsuario}`, {
    method: "DELETE",
  });
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
