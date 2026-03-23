import { useState, useEffect } from "react";
import { COLORS as C, AULAS_MOCK } from "../constants";
import { ProjectorIcon } from "../components/Icons";
import AulaCard from "../components/AulaCard";

export default function AulaSelectPage({ onSelect }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  // TODO: Reemplazar AULAS_MOCK con llamada a projectorService.getAulas()
  const aulas = AULAS_MOCK;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "40px 24px",
      }}
    >
      {/* Logo y título */}
      <div
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(-20px)",
          transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
          marginBottom: 44,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            margin: "0 auto 16px",
            border: `2px solid ${C.blue}`,
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ProjectorIcon size={26} color={C.blue} />
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: C.blue,
            letterSpacing: -0.3,
            margin: 0,
          }}
        >
          LuxRoom
        </h1>
        <p style={{ fontSize: 13, color: C.textSub, marginTop: 8 }}>
          Selecciona tu aula para continuar
        </p>
      </div>

      {/* Lista de aulas */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {aulas.map((aula, i) => (
          <AulaCard
            key={aula.id}
            aula={aula}
            onClick={() => onSelect(aula)}
            delay={0.18 + i * 0.09}
            visible={show}
          />
        ))}
      </div>
    </div>
  );
}
