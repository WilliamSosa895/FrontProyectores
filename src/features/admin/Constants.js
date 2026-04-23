// Paleta de colores del módulo admin (misma que user para coherencia)
export const COLORS = {
  bg:       "#1a1a1e",
  card:     "#2a2a2f",
  border:   "#2196F3",
  blue:     "#2196F3",
  blueDim:  "#1565C0",
  white:    "#ffffff",
  textMain: "#ffffff",
  textSub:  "#9e9e9e",
  green:    "#4caf50",
  orange:   "#ff9800",
  red:      "#f44336",
  cyan:     "#00bcd4",
};

// Datos mock de aulas (reemplazar por API)
export const AULAS_MOCK = [
  {
    id: 1, nombre: "Aula 101", ubicacion: "Edificio A · Piso 1",
    estado: "activa", lux: 102,
    proyector: true, persianas: true, monitor: true, luces: true, telon: true,
  },
  {
    id: 2, nombre: "Aula 777", ubicacion: "Edificio B · Piso 7",
    estado: "activa", lux: 62,
    proyector: false, persianas: false, monitor: false, luces: true, telon: false,
  },
  {
    id: 3, nombre: "Aula 67", ubicacion: "Edificio C · Piso 6",
    estado: "activa", lux: 0,
    proyector: false, persianas: true, monitor: false, luces: false, telon: false,
  },
  {
    id: 4, nombre: "Aula 302", ubicacion: "Edificio A · Piso 3",
    estado: "inactiva", lux: 280,
    proyector: false, persianas: true, monitor: false, luces: true, telon: false,
  },
];
