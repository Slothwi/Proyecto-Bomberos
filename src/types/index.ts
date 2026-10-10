export type { RegisterPayload, Session, SessionUser } from "../lib/api";
export type { ApiError } from "../lib/api";

export type ViewName = "dashboard" | "dotacion" | "perfil";

export interface Incident {
  code: string;
  title: string;
  address: string;
  time: string;
  unit: string;
  level: string;
  tone: "critical" | "warning" | "stable";
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  type: string;
  status: string;
  location: string;
}

export interface CrewMember {
  initials: string;
  name: string;
  role: string;
  certifications: string[];
}

export interface Firefighter {
  id: string;
  rut?: string;
  email?: string;
  name: string;
  roleCode?: string;
  role: string;
  shift: string;
  certifications: string[];
  status: string;
}
