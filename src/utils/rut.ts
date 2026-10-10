// Normaliza a formato canónico xxxxxxxx-d (puede quedar con prefijo largo si es inválido)
export function normalizeRut(raw: string): string {
  const clean = raw.replace(/[.\s]/g, "").toUpperCase();
  if (/^\d{7,8}-[0-9K]$/.test(clean)) return clean;
  if (/^\d{7,8}[0-9K]$/.test(clean)) {
    return `${clean.slice(0, -1)}-${clean.slice(-1)}`;
  }
  return clean;
}

export function isValidRut(raw: string): boolean {
  const clean = normalizeRut(raw);
  if (!/^\d{7,8}-[0-9K]$/.test(clean)) return false;
  const body = clean.slice(0, -2);
  const dv = clean.slice(-1);
  return dv === computeRutDv(body);
}

function computeRutDv(body: string): string {
  const digits = body.split("").map(Number).reverse();
  let factor = 2;
  let sum = 0;
  for (const digit of digits) {
    sum += digit * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return "0";
  if (remainder === 10) return "K";
  return String(remainder);
}
