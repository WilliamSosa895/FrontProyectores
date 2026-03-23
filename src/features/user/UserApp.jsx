import { useState } from "react";
import { COLORS as C } from "./constants";
import AulaSelectPage from "./pages/AulaSelectPage";
import ProjectorControlPage from "./pages/ProjectorControlPage";

export default function UserApp() {
  const [selectedAula, setSelectedAula] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
        color: C.textMain,
      }}
    >
      {selectedAula ? (
        <ProjectorControlPage
          aula={selectedAula}
          onBack={() => setSelectedAula(null)}
        />
      ) : (
        <AulaSelectPage onSelect={setSelectedAula} />
      )}
    </div>
  );
}
