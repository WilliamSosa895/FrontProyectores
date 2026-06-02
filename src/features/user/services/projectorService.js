import { apiFetch, ensurePositiveInt } from "../../../services/api";

export async function getAulas() {
  return apiFetch("/api/aulas");
}

export async function getAulaDetalle(idAula) {
  return apiFetch(`/api/aulas/${ensurePositiveInt(idAula, "Aula")}`);
}

export async function getDispositivosAula(idAula) {
  return apiFetch(`/api/aulas/${ensurePositiveInt(idAula, "Aula")}/dispositivos`);
}

export async function solicitarEncendido(idAula) {
  const aula = ensurePositiveInt(idAula, "Aula");
  return apiFetch("/api/solicitudes", {
    method: "POST",
    body: JSON.stringify({ idAula: aula }),
  });
}

export async function solicitarApagado(idAula) {
  const aula = ensurePositiveInt(idAula, "Aula");
  return apiFetch("/api/solicitudes/apagar", {
    method: "POST",
    body: JSON.stringify({ idAula: aula }),
  });
}

export async function getSolicitud(idSolicitud) {
  return apiFetch(`/api/solicitudes/${ensurePositiveInt(idSolicitud, "Solicitud")}`);
}

export async function getLuxHistorial(idAula, limite = 1) {
  const aula = ensurePositiveInt(idAula, "Aula");
  const max = ensurePositiveInt(limite, "Límite");
  return apiFetch(`/api/aulas/${aula}/lux?limite=${max}`);
}
