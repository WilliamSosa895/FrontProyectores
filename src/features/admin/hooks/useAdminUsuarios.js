import { useCallback, useEffect, useState } from "react";
import { getRoles, getUsuarios } from "../services/adminService";

const ALLOWED_ROLE_NAMES = new Set(["administrador", "docente"]);

function normalizeRole(role) {
  return {
    id: role.idRol ?? role.id ?? null,
    nombre: role.nombreRol ?? role.nombre ?? "Rol",
  };
}

function normalizeUsuario(usuario) {
  const rol = usuario.rol || {};

  return {
    id: usuario.idUsuario ?? usuario.id ?? null,
    nombre: usuario.nombre ?? "",
    estado: (usuario.estado ?? "activo").toLowerCase(),
    rolId: rol.idRol ?? usuario.idRol ?? null,
    rolNombre: rol.nombreRol ?? usuario.rolNombre ?? "Sin rol",
  };
}

function isAllowedRoleName(nombre) {
  return ALLOWED_ROLE_NAMES.has(String(nombre || "").toLowerCase());
}

export default function useAdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [usuariosData, rolesData] = await Promise.all([
        getUsuarios(),
        getRoles(),
      ]);

      const normalizedUsuarios = Array.isArray(usuariosData)
        ? usuariosData
          .map(normalizeUsuario)
          .filter((usuario) => isAllowedRoleName(usuario.rolNombre))
          .sort((a, b) => {
          const stateWeight = (a.estado === "activo" ? 0 : 1) - (b.estado === "activo" ? 0 : 1);
          if (stateWeight !== 0) return stateWeight;
          return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
        })
        : [];

      const normalizedRoles = Array.isArray(rolesData)
        ? rolesData
          .map(normalizeRole)
          .filter((role) => isAllowedRoleName(role.nombre))
        : [];

      setUsuarios(normalizedUsuarios);
      setRoles(normalizedRoles);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la gestión de usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    usuarios,
    roles,
    error,
    loading,
    refresh: fetchData,
  };
}