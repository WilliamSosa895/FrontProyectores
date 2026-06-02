import { apiFetch, ensureNonEmptyString, ensurePositiveInt } from "../../../services/api";

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
  const nombre = ensureNonEmptyString(payload?.nombre, "Nombre");
  const idRol = ensurePositiveInt(payload?.idRol, "Rol");
  const password = ensureNonEmptyString(payload?.password, "Contraseña");

  return apiFetch("/api/usuarios", {
    method: "POST",
    body: JSON.stringify({ ...payload, nombre, idRol, password }),
  });
}

export async function actualizarUsuario(idUsuario, payload) {
  const usuarioId = ensurePositiveInt(idUsuario, "Usuario");
  const nombre = ensureNonEmptyString(payload?.nombre, "Nombre");
  const idRol = ensurePositiveInt(payload?.idRol, "Rol");

  return apiFetch(`/api/usuarios/${usuarioId}`, {
    method: "PUT",
    body: JSON.stringify({ ...payload, nombre, idRol }),
  });
}

export async function desactivarUsuario(idUsuario) {
  return apiFetch(`/api/usuarios/${ensurePositiveInt(idUsuario, "Usuario")}`, {
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
  return apiFetch(`/api/eventos?idAula=${ensurePositiveInt(idAula, "Aula")}`);
}

export async function getAuditoriaAula(idAula) {
  return apiFetch(`/api/aulas/${ensurePositiveInt(idAula, "Aula")}/auditoria`);
}

export async function controlarActuadorAula(idAula, tipo, action) {
  const aula = ensurePositiveInt(idAula, "Aula");
  const deviceType = ensureNonEmptyString(tipo, "Tipo de actuador");
  const actuatorAction = ensureNonEmptyString(action, "Acción");

  return apiFetch(`/api/admin/aulas/${aula}/actuadores/${deviceType}`, {
    method: "POST",
    body: JSON.stringify({ action: actuatorAction }),
  });
}
