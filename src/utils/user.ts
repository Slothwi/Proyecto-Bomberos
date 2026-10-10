export const ROL_LABELS: Record<string, string> = {
  CAPITAN: "Capitán",
  OFICIAL: "Oficial",
  MAQUINISTA: "Maquinista",
  ADMINISTRATIVO: "Administrativo",
  VOLUNTARIO: "Voluntario",
};

export function rolLabelFor(rol: string): string {
  return ROL_LABELS[rol] ?? rol;
}

export function initialsOf(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}
