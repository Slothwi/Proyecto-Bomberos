import { useState, type FormEvent } from "react";
import companyLogo from "../assets/logo-bomberos.png";
import { Icon } from "../components/Icon";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../lib/api";
import ThemeToggle from "../components/ThemeToggle";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthView() {
  const { login, expiredTick } = useAuth();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const loginValid = emailRe.test(loginForm.email) && loginForm.password.length > 0;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!loginValid) {
      setError("Ingresa un correo válido y tu contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      await login(loginForm.email.trim(), loginForm.password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell auth-shell">
      <div className="auth-theme-toggle"><ThemeToggle /></div>
      <div className="auth-card">
        <div className="auth-brand">
          <img alt="Emblema Bomba España, 10ª Compañía" className="auth-emblem" src={companyLogo} />
          <div className="auth-kicker">CUERPO DE BOMBEROS DE SANTIAGO</div>
          <div className="auth-title">10ª COMPAÑÍA · BOMBA ESPAÑA</div>
          <div className="auth-subtitle">Centro de Mando — Acceso restringido a personal autorizado</div>
        </div>

        {expiredTick > 0 && (
          <div className="auth-alert error">
            <Icon name="close" size={15} /> Tu sesión expiró (el token dura 8h). Vuelve a iniciar sesión.
          </div>
        )}
        {notice && (
          <div className="auth-alert success">
            <Icon name="check" size={15} /> {notice}
          </div>
        )}
        {error && (
          <div className="auth-alert error">
            <Icon name="close" size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="auth-email">
            CORREO INSTITUCIONAL
            <input
              id="auth-email"
              autoComplete="email"
              placeholder="p.ej. pepe.fuego@bomba10.cl"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />
          </label>
          <label htmlFor="auth-pass">
            CONTRASEÑA
            <input
              id="auth-pass"
              autoComplete="current-password"
              placeholder="••••••••"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </label>
          <button
            className="auth-submit"
            disabled={submitting || !loginValid}
            type="submit"
          >
            <Icon name="lock" size={16} />
            {submitting ? "Verificando..." : "Ingresar al Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
