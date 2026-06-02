/* eslint-disable sonarjs/cognitive-complexity */
import { useEffect, useMemo, useState } from "react";
import { COLORS as C } from "../constants";
import { UserIcon } from "../components/Icons";
import useAdminUsuarios from "../hooks/useAdminUsuarios";
import {
  actualizarUsuario,
  crearUsuario,
  desactivarUsuario,
} from "../services/adminService";

const INITIAL_FORM = {
  nombre: "",
  password: "",
  rolId: "",
  estado: "activo",
};

function getSubmitLabel(saving, editingUserId) {
  if (saving) return "Guardando...";
  if (editingUserId) return "Guardar cambios";
  return "Crear usuario";
}

function getDeactivateLabel(isBusy, estado) {
  if (isBusy) return "Procesando...";
  if (estado === "inactivo") return "Desactivado";
  return "Desactivar";
}

function UsersManagementPage() {
  const { usuarios, roles, error, loading, refresh } = useAdminUsuarios();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingUserId, setEditingUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyUserId, setBusyUserId] = useState(null);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  const defaultRoleId = useMemo(() => {
    const docente = roles.find((role) => role.nombre.toLowerCase() === "docente") || roles[0];
    return docente ? String(docente.id) : "";
  }, [roles]);

  useEffect(() => {
    if (form.rolId || roles.length === 0 || editingUserId) return;

    const docente = roles.find((role) => role.nombre.toLowerCase() === "docente") || roles[0];
    if (docente) {
      setForm((current) => ({ ...current, rolId: String(docente.id) }));
    }
  }, [roles, form.rolId, editingUserId]);

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "todos" || String(usuario.rolId) === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activos = usuarios.filter((usuario) => usuario.estado === "activo").length;
  const inactivos = usuarios.filter((usuario) => usuario.estado === "inactivo").length;

  function resetForm() {
    setEditingUserId(null);
    setForm({
      nombre: "",
      password: "",
      rolId: defaultRoleId,
      estado: "activo",
    });
    setFormError(null);
    setFormSuccess(null);
  }

  function startEdit(usuario) {
    setEditingUserId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      password: "",
      rolId: usuario.rolId ? String(usuario.rolId) : defaultRoleId,
      estado: usuario.estado || "activo",
    });
    setFormError(null);
    setFormSuccess(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const nombre = form.nombre.trim();
    const rolId = Number(form.rolId);
    const password = form.password.trim();
    const estado = form.estado?.trim().toLowerCase();

    if (!nombre) {
      setFormError("El nombre es obligatorio");
      return;
    }

    if (nombre.length < 3 || nombre.length > 80) {
      setFormError("El nombre debe tener entre 3 y 80 caracteres");
      return;
    }

    if (!Number.isInteger(rolId) || rolId <= 0) {
      setFormError("Selecciona un rol válido");
      return;
    }

    if (!editingUserId && password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password && (password.length < 6 || password.length > 128)) {
      setFormError("La contraseña debe tener entre 6 y 128 caracteres");
      return;
    }

    if (editingUserId && !["activo", "inactivo"].includes(estado)) {
      setFormError("Selecciona un estado válido");
      return;
    }

    const payload = {
      nombre,
      idRol: rolId,
    };

    if (editingUserId) {
      payload.estado = estado;
      if (password) {
        payload.password = password;
      }
    } else {
      payload.password = password;
    }

    try {
      setSaving(true);
      if (editingUserId) {
        await actualizarUsuario(editingUserId, payload);
        setFormSuccess("Usuario actualizado");
      } else {
        await crearUsuario(payload);
        setFormSuccess("Usuario creado");
      }
      await refresh();
      resetForm();
    } catch (err) {
      setFormError(err.message || "No se pudo guardar el usuario");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(usuario) {
    const confirmed = globalThis.confirm(`Desactivar a ${usuario.nombre}?`);
    if (!confirmed) return;

    try {
      setBusyUserId(usuario.id);
      await desactivarUsuario(usuario.id);
      if (editingUserId === usuario.id) {
        resetForm();
      }
      await refresh();
      setFormSuccess("Usuario desactivado");
    } catch (err) {
      setFormError(err.message || "No se pudo desactivar el usuario");
    } finally {
      setBusyUserId(null);
    }
  }

  function cancelEdit() {
    resetForm();
  }

  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(12px)",
      transition: "all 0.45s ease",
    }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: C.blue + "18",
            border: `1px solid ${C.blue}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.blue,
          }}>
            <UserIcon size={16} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.white }}>
              Gestión de docentes y usuarios
            </div>
            <div style={{ fontSize: 11, color: C.textSub }}>
              Crear, editar rol y desactivar usuarios desde el panel de administrador
            </div>
          </div>
        </div>
      </div>

      {(error || formError || formSuccess) && (
        <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {error && (
            <div style={{
              background: "#f4433615",
              border: "1px solid #f4433640",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 12,
              color: C.red,
            }}>
              {error}
            </div>
          )}
          {formError && (
            <div style={{
              background: "#f4433615",
              border: "1px solid #f4433640",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 12,
              color: C.red,
            }}>
              {formError}
            </div>
          )}
          {formSuccess && (
            <div style={{
              background: "#4caf5015",
              border: "1px solid #4caf5040",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 12,
              color: C.green,
            }}>
              {formSuccess}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
        <div style={{ background: C.card, borderRadius: 10, padding: "14px 12px", border: `1.5px solid ${C.border}` }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.blue }}>{usuarios.length}</div>
          <div style={{ fontSize: 10, color: C.textSub, marginTop: 2 }}>Usuarios totales</div>
        </div>
        <div style={{ background: C.card, borderRadius: 10, padding: "14px 12px", border: `1.5px solid ${C.border}` }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.green }}>{activos}</div>
          <div style={{ fontSize: 10, color: C.textSub, marginTop: 2 }}>Activos</div>
        </div>
        <div style={{ background: C.card, borderRadius: 10, padding: "14px 12px", border: `1.5px solid ${C.border}` }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.orange }}>{inactivos}</div>
          <div style={{ fontSize: 10, color: C.textSub, marginTop: 2 }}>Inactivos</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(290px, 360px) minmax(0, 1fr)", gap: 14, alignItems: "start" }}>
        <div style={{
          background: C.card,
          borderRadius: 12,
          padding: 16,
          border: `1.5px solid ${C.border}`,
          position: "sticky",
          top: 76,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>
                {editingUserId ? "Editar usuario" : "Nuevo docente"}
              </div>
              <div style={{ fontSize: 11, color: C.textSub }}>
                La contraseña solo es obligatoria al crear
              </div>
            </div>
            {editingUserId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.textSub,
                  padding: "6px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, color: C.textSub }}>Nombre completo</span>
              <input
                value={form.nombre}
                onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                placeholder="Ej. Ana Pérez"
                style={{
                  background: "#1f1f23",
                  border: `1px solid ${C.border}40`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  color: C.white,
                  fontFamily: "inherit",
                  fontSize: 13,
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, color: C.textSub }}>
                Contraseña {editingUserId ? "(opcional)" : "*"}
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder={editingUserId ? "Dejar en blanco si no cambia" : "Mínimo 6 caracteres"}
                style={{
                  background: "#1f1f23",
                  border: `1px solid ${C.border}40`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  color: C.white,
                  fontFamily: "inherit",
                  fontSize: 13,
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, color: C.textSub }}>Rol</span>
              <select
                value={form.rolId}
                onChange={(event) => setForm((current) => ({ ...current, rolId: event.target.value }))}
                style={{
                  background: "#1f1f23",
                  border: `1px solid ${C.border}40`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  color: C.white,
                  fontFamily: "inherit",
                  fontSize: 13,
                }}
              >
                {!roles.length && <option value="">Cargando roles...</option>}
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.nombre}</option>
                ))}
              </select>
            </label>

            {editingUserId && (
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, color: C.textSub }}>Estado</span>
                <select
                  value={form.estado}
                  onChange={(event) => setForm((current) => ({ ...current, estado: event.target.value }))}
                  style={{
                    background: "#1f1f23",
                    border: `1px solid ${C.border}40`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    color: C.white,
                    fontFamily: "inherit",
                    fontSize: 13,
                  }}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>
            )}

            <button
              type="submit"
              disabled={saving || loading || !roles.length}
              style={{
                marginTop: 4,
                background: C.blue,
                border: "none",
                borderRadius: 8,
                padding: "10px 12px",
                color: C.white,
                fontSize: 13,
                fontWeight: 700,
                cursor: saving || loading || !roles.length ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: saving || loading || !roles.length ? 0.7 : 1,
              }}
            >
              {getSubmitLabel(saving, editingUserId)}
            </button>
          </form>
        </div>

        <div style={{
          background: C.card,
          borderRadius: 12,
          padding: 16,
          border: `1.5px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre"
                style={{
                  width: "100%",
                  background: "#1f1f23",
                  border: `1px solid ${C.border}40`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  color: C.white,
                  fontFamily: "inherit",
                  fontSize: 13,
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setRoleFilter("todos")}
              style={{
                background: roleFilter === "todos" ? C.blue + "25" : "transparent",
                border: `1px solid ${roleFilter === "todos" ? C.blue : C.border}40`,
                borderRadius: 8,
                color: roleFilter === "todos" ? C.white : C.textSub,
                padding: "9px 12px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Todos
            </button>
            {roles.map((role) => {
              const selected = roleFilter === String(role.id);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setRoleFilter(String(role.id))}
                  style={{
                    background: selected ? C.blue + "25" : "transparent",
                    border: `1px solid ${selected ? C.blue : C.border}40`,
                    borderRadius: 8,
                    color: selected ? C.white : C.textSub,
                    padding: "9px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {role.nombre}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>Lista de usuarios</div>
              <div style={{ fontSize: 11, color: C.textSub }}>
                Activos e inactivos cargados desde el backend
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.textSub }}>
              {filteredUsuarios.length} resultado{filteredUsuarios.length === 1 ? "" : "s"}
            </div>
          </div>

          {loading && (
            <div style={{ color: C.textSub, fontSize: 13, padding: "12px 0" }}>
              Cargando usuarios...
            </div>
          )}

          {!loading && filteredUsuarios.length === 0 && (
            <div style={{ color: C.textSub, fontSize: 13, padding: "12px 0" }}>
              No hay usuarios para el filtro seleccionado
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredUsuarios.map((usuario) => {
              const isEditing = editingUserId === usuario.id;
              const isBusy = busyUserId === usuario.id;

              return (
                <div key={usuario.id} style={{
                  borderRadius: 10,
                  border: `1px solid ${isEditing ? C.blue : C.border}40`,
                  padding: "12px 14px",
                  background: isEditing ? C.blue + "08" : "#1f1f23",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
                      <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: usuario.estado === "activo" ? C.green + "15" : "#44444440",
                        border: `1px solid ${usuario.estado === "activo" ? C.green + "35" : "#444"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <UserIcon size={16} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 4 }}>
                          {usuario.nombre}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <span style={{
                            fontSize: 10,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: C.blue + "18",
                            color: C.blue,
                          }}>
                            {usuario.rolNombre}
                          </span>
                          <span style={{
                            fontSize: 10,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: usuario.estado === "activo" ? C.green + "18" : C.orange + "18",
                            color: usuario.estado === "activo" ? C.green : C.orange,
                          }}>
                            {usuario.estado}
                          </span>
                          <span style={{
                            fontSize: 10,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "#44444440",
                            color: C.textSub,
                          }}>
                            ID {usuario.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => startEdit(usuario)}
                        style={{
                          background: isEditing ? C.blue + "28" : "transparent",
                          border: `1px solid ${isEditing ? C.blue : C.border}60`,
                          borderRadius: 8,
                          color: C.white,
                          padding: "7px 10px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeactivate(usuario)}
                        disabled={isBusy || usuario.estado === "inactivo"}
                        style={{
                          background: "transparent",
                          border: `1px solid ${C.red}60`,
                          borderRadius: 8,
                          color: C.red,
                          padding: "7px 10px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: isBusy || usuario.estado === "inactivo" ? "not-allowed" : "pointer",
                          fontFamily: "inherit",
                          opacity: isBusy || usuario.estado === "inactivo" ? 0.6 : 1,
                        }}
                      >
                        {getDeactivateLabel(isBusy, usuario.estado)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersManagementPage;