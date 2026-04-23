import { useState, useEffect } from "react";
import { COLORS as C } from "../constants";
import { ProjectorIcon } from "../components/Icons";
import AulaCard from "../components/AulaCard";
import { getAulas } from "../services/projectorService";

function AulaSelectPage({ onSelect }) {
  const [show, setShow] = useState(false);
  const [aulas, setAulas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    fetchAulas();
  }, []);

  async function fetchAulas() {
    try {
      const data = await getAulas();
      // Normalizar datos de la API
      const normalized = data.map((a) => ({
        id: a.idAula || a.id,
        nombre: a.nombre || a.ubicacion || `Aula ${a.idAula || a.id}`,
        edificio: a.ubicacion || "",
        piso: "",
      }));
      setAulas(normalized);
      setError(null);
    } catch (err) {
      setError("No se puede conectar al servidor. Verifica que el backend esté corriendo.");
      setAulas([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: "40px 24px",
    }}>
      <div style={{
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-20px)",
        transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
        marginBottom: 44, textAlign: "center",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: "0 auto 16px",
          border: `2px solid ${C.blue}`, background: "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ProjectorIcon size={26} color={C.blue} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.blue, margin: 0 }}>
          LuxRoom
        </h1>
        <p style={{ fontSize: 13, color: C.textSub, marginTop: 8 }}>
          Selecciona tu aula para continuar
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "#f4433615", border: "1px solid #f4433640",
          borderRadius: 10, padding: "14px 18px", marginBottom: 20,
          fontSize: 13, color: "#f44336", textAlign: "center",
          maxWidth: 400, width: "100%",
        }}>
          {error}
          <button onClick={fetchAulas} style={{
            display: "block", margin: "10px auto 0", padding: "6px 16px",
            borderRadius: 6, border: `1px solid ${C.blue}`, background: "transparent",
            color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit",
          }}>
            Reintentar
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <p style={{ color: C.textSub, fontSize: 14 }}>Cargando aulas...</p>
      )}

      {/* Aulas */}
      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
        {aulas.map((aula, i) => (
          <AulaCard
            key={aula.id}
            aula={aula}
            onClick={() => onSelect(aula)}
            delay={0.18 + i * 0.09}
            visible={show && !loading}
          />
        ))}
      </div>
    </div>
  );
}

export default AulaSelectPage;
