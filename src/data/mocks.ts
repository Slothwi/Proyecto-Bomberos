import type { Incident, InventoryItem } from "../types";

export const incidents: Incident[] = [
  {
    code: "10-0-1",
    title: "Fuego estructural",
    address: "Av. España 1480, Santiago",
    time: "08:42",
    unit: "B-10",
    level: "Alarma activa",
    tone: "critical",
  },
  {
    code: "10-3-1",
    title: "Rescate vehicular",
    address: "Ruta 5 / Enlace Toesca",
    time: "07:18",
    unit: "RX-10",
    level: "En operación",
    tone: "warning",
  },
  {
    code: "10-6-1",
    title: "Materiales peligrosos",
    address: "Sector Industrial Norte",
    time: "06:55",
    unit: "H-10",
    level: "Controlado",
    tone: "stable",
  },
];

export const initialInventory: InventoryItem[] = [
  { id: "EQ-01", name: "Bomba B-10", category: "Vehículo", type: "Carro Bomba 4.000L", status: "Disponible", location: "Cuartel Central" },
  { id: "EQ-02", name: "Rescate RX-10", category: "Vehículo", type: "Rescate Pesado", status: "En servicio", location: "Ruta 5 / Toesca" },
  { id: "EQ-03", name: "HazMat H-10", category: "Vehículo", type: "Materiales Peligrosos", status: "Disponible", location: "Cuartel Central" },
  { id: "EQ-04", name: "Equipos ERA (x14)", category: "Equipamiento", type: "Respiración Autónoma", status: "Disponible", location: "Pañol de Equipos" },
  { id: "EQ-05", name: "Equipos ERA (x2)", category: "Equipamiento", type: "Respiración Autónoma", status: "Mantenimiento", location: "Taller Central" },
  { id: "EQ-06", name: "Traje Estructural #12", category: "EPI", type: "Protección Personal", status: "Fuera de servicio", location: "Bodega" },
];
