import { useState, useEffect } from "react";
import { COLORS as C } from "../constants";
import { ArrowLeftIcon } from "../components/Icons";
import MiniChart from "../components/MiniChart";
import { getEventosAula, getLuxHistorial } from "../services/adminService";

function HistoricalPage({ aulas, onBack }) {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [period, setPeriod] = useState("hoy");
  const [luxData, setLuxData] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  useEffect(() => {
    if (!selected) return;
    cargarHistorico(selected.id, period);
  }, [selected, period]);

  function calcularLimite(periodo) {
    if (periodo === "mes") return 200;
    if (periodo === "semana") return 100;
    return 50;
  }

  async function cargarHistorico(idAula, periodo) {
    setLoading(true);
    setError(null);
    try {
      const limite = calcularLimite(periodo);
      const [lux, ev] = await Promise.all([
        getLuxHistorial(idAula, limite),
        getEventosAula(idAula),
      ]);

      const luxNormalizado = (Array.isArray(lux) ? lux : []).map((x) => ({
        t: x.timestamp,
        v: Number(x.valorLux) || 0,
      }));

      setLuxData(luxNormalizado);
      setEventos(Array.isArray(ev) ? ev : []);
    } catch (e) {
      setError("No se pudieron cargar datos historicos del backend");
      setLuxData([]);
      setEventos([]);
    } finally {
      setLoading(false);
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
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>
            Datos Históricos
          </div>
          <div style={{ fontSize: 11, color: C.textSub }}>
            Selecciona un aula para ver registros
          </div>
        </div>
      </div>

      {/* Selector de aulas */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {aulas.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelected(a)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: selected?.id === a.id ? C.blue : C.card,
              border: `1.5px solid ${selected?.id === a.id ? C.blue : C.border}`,
              color: selected?.id === a.id ? C.white : C.textSub,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            {a.nombre}
          </button>
        ))}
      </div>

      {selected && (
        <>
          {/* Selector de periodo */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {[
              { id: "hoy", label: "Hoy" },
              { id: "semana", label: "Semana" },
              { id: "mes", label: "Mes" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  background: period === p.id ? C.blue + "30" : "transparent",
                  border: `1px solid ${period === p.id ? C.blue : "#444"}`,
                  color: period === p.id ? C.blue : C.textSub,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {error && (
            <div
              style={{
                background: "#f4433615",
                border: "1px solid #f4433640",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 16,
                fontSize: 12,
                color: "#f44336",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {loading && (
            <p style={{ color: C.textSub, fontSize: 12, marginBottom: 16 }}>
              Cargando historico...
            </p>
          )}

          {!loading && luxData.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <MiniChart data={luxData} color={C.blue} label={`Lux - ${selected.nombre}`} unit=" lx" />
            </div>
          )}

          <div
            style={{
              background: C.card,
              border: `1.5px solid ${C.border}40`,
              borderRadius: 12,
              padding: "14px 14px",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 10 }}>
              Ultimos eventos MQTT
            </div>

            {eventos.length === 0 ? (
              <div style={{ fontSize: 12, color: C.textSub }}>
                No hay eventos disponibles para esta aula
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {eventos.slice(0, 12).map((e) => (
                  <div
                    key={e.idEvento}
                    style={{
                      border: "1px solid #333",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontSize: 11,
                      color: C.textSub,
                    }}
                  >
                    <div style={{ color: C.white, fontWeight: 600, marginBottom: 4 }}>
                      {e.tipoEvento?.descripcion || "evento"}
                    </div>
                    <div style={{ marginBottom: 2 }}>{e.topicoMqtt}</div>
                    <div>{e.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!selected && aulas.length === 0 && (
        <p style={{ color: C.textSub, fontSize: 13, textAlign: "center", marginTop: 20 }}>
          No hay aulas disponibles
        </p>
      )}
    </div>
  );
}

export default HistoricalPage;
