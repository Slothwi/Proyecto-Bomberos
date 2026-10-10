export interface SessionUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rut: string;
  rol: string;
}

export interface Session {
  token: string;
  user: SessionUser;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "bomberos_token";
const USER_KEY = "bomberos_user";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError("No hay conexión con el servidor. Verifica que el backend esté en marcha.", 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message ?? `Error ${response.status}`, response.status);
  }
  return data as T;
}

export interface RegisterPayload {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol?: string;
}

export async function register(payload: RegisterPayload): Promise<{ message: string; user: SessionUser }> {
  const token = localStorage.getItem(TOKEN_KEY);

  return request("/auth/register", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function login(email: string, password: string): Promise<Session> {
  const data = await request<{ message: string; token: string; user: SessionUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveSession(data);
  return data;
}

export function saveSession(session: Session): void {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function getSession(): Session | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  if (!token || !rawUser) return null;
  try {
    return { token, user: JSON.parse(rawUser) as SessionUser };
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function fetchWithAuth(path: string, init: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
      ...(init.headers ?? {}),
    },
  });
}