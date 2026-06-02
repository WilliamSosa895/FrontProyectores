/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { COLORS as C } from "../constants";
import {
  ArrowLeftIcon,
  MapPinIcon,
  ProjectorIcon,
  BlindsIcon,
  MonitorIcon,
  LightbulbIcon,
  ScreenDropIcon,
} from "../components/Icons";
import LuxBar from "../components/LuxBar";
import DeviceStatus from "../components/DeviceStatus";
import StatCard from "../components/StatCard";
import { getAuditoriaAula } from "../services/adminService";
import { controlarActuadorAula } from "../services/adminService";

function AulaDetailPage({ aula, luxValue, onBack }) {
  const [show, setShow] = useState(false);
  const [busyKey, setBusyKey] = useState(null);
  const [audit, setAudit] = useState(null);
  const [auditError, setAuditError] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  useEffect(() => {
    let active = true;

    async function loadAudit() {
      if (!aula?.id) return;
      setAuditLoading(true);
      setAuditError(null);
      try {
        const data = await getAuditoriaAula(aula.id);
        if (active) setAudit(data);
      } catch (err) {
        if (active) {
          setAudit(null);
          setAuditError("No se pudo cargar la auditoría del aula");
        }
      } finally {
        if (active) setAuditLoading(false);
      }
    }

    loadAudit();
    return () => {
      active = false;
    };
  }, [aula?.id]);

  const currentLux = luxValue ?? aula.lux;

  function isDeviceOn(tipo) {
    if (tipo === "blind") return !aula.persianas;
    if (tipo === "projector") return Boolean(aula.proyector);
    if (tipo === "light") return Boolean(aula.luces);
    if (tipo === "screen") return Boolean(aula.telon);
    return false;
  }

  async function toggleActuator(tipo, actionOn, actionOff) {
    const isCurrentlyOn = isDeviceOn(tipo);
    const action = isCurrentlyOn ? actionOff : actionOn;
    const key = `${tipo}:${action}`;

    try {
      setBusyKey(key);
      await controlarActuadorAula(aula.id, tipo, action);
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateX(0)" : "translateX(20px)",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: `1.5px solid ${C.border}`,
            borderRadius: 10,
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <ArrowLeftIcon />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.white }}>
            {aula.nombre}
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.textSub,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MapPinIcon /> {aula.ubicacion}
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: 6,
            background: aula.estado === "activa" ? C.green + "20" : "#44444440",
            color: aula.estado === "activa" ? C.green : C.textSub,
            border: `1px solid ${aula.estado === "activa" ? C.green + "40" : "#444"}`,
          }}
        >
          {aula.proyector ? "En sesión" : aula.estado === "activa" ? "Activa" : "Inactiva"}
        </span>
      </div>

      <div
        style={{
          background: C.card,
          borderRadius: 12,
          padding: 18,
          border: `1.5px solid ${C.border}`,
          marginBottom: 14,
        }}
      >
        <LuxBar value={currentLux} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <DeviceStatus
          icon={<ProjectorIcon size={16} color={aula.proyector ? C.green : C.textSub} />}
          label="Proyector"
          on={aula.proyector}
          color={C.green}
          onToggle={() => toggleActuator("projector", "TURN_ON", "TURN_OFF")}
          disabled={busyKey === `projector:${aula.proyector ? "TURN_OFF" : "TURN_ON"}`}
        />
        <DeviceStatus
          icon={<BlindsIcon size={16} color={!aula.persianas ? C.blue : C.textSub} />}
          label="Persianas"
          on={!aula.persianas}
          color={C.blue}
          onToggle={() => toggleActuator("blind", "OPEN", "CLOSE")}
          disabled={busyKey === `blind:${aula.persianas ? "OPEN" : "CLOSE"}`}
        />
        <DeviceStatus
          icon={<MonitorIcon size={16} color={aula.monitor ? C.cyan : C.textSub} />}
          label="Monitor / Tele"
          on={aula.monitor}
          color={C.cyan}
        />
        <DeviceStatus
          icon={<LightbulbIcon size={16} color={aula.luces ? C.orange : C.textSub} />}
          label="Luces"
          on={aula.luces}
          color={C.orange}
          onToggle={() => toggleActuator("light", "TURN_ON", "TURN_OFF")}
          disabled={busyKey === `light:${aula.luces ? "TURN_OFF" : "TURN_ON"}`}
        />
        <DeviceStatus
          icon={<ScreenDropIcon size={16} color={aula.telon ? C.blue : C.textSub} />}
          label="Telón / Pantalla"
          on={aula.telon}
          color={C.blue}
          onToggle={() => toggleActuator("screen", "DEPLOY", "RETRACT")}
          disabled={busyKey === `screen:${aula.telon ? "RETRACT" : "DEPLOY"}`}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 10 }}>
          Auditoría por aula
        </div>

        {auditLoading ? (
          <div style={{ color: C.textSub, fontSize: 12 }}>Cargando auditoría...</div>
        ) : auditError ? (
          <div style={{ color: C.red, fontSize: 12 }}>{auditError}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            <StatCard value={audit?.totalAcciones ?? 0} label="Total acciones" visible={show} />
            <StatCard value={audit?.lucesApagadas ?? 0} label="Luces apagadas" visible={show} />
            <StatCard value={audit?.lucesEncendidas ?? 0} label="Luces encendidas" visible={show} />
            <StatCard value={audit?.persianasCerradas ?? 0} label="Persianas cerradas" visible={show} />
            <StatCard value={audit?.persianasAbiertas ?? 0} label="Persianas abiertas" visible={show} />
            <StatCard value={audit?.telonDesplegado ?? 0} label="Telón desplegado" visible={show} />
            <StatCard value={audit?.proyectorEncendido ?? 0} label="Proyector encendido" visible={show} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AulaDetailPage;

