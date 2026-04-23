import { useState, useEffect } from "react";
import { COLORS as C } from "../constants";
import { ArrowLeftIcon } from "../components/Icons";

function HistoricalPage({ aulas, onBack }) {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [period, setPeriod] = useState("hoy");

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

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

          {/* Sin datos históricos disponibles */}
          <div
            style={{
              background: C.card,
              border: `1.5px solid ${C.border}40`,
              borderRadius: 12,
              padding: "40px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, color: C.textSub }}>
              No hay datos históricos disponibles para{" "}
              <span style={{ color: C.white, fontWeight: 600 }}>{selected.nombre}</span>
            </div>
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
