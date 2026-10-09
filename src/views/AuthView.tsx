import { useState, type FormEvent } from "react";
import companyLogo from "../assets/logo-bomberos.png";
import { Icon } from "../components/Icon";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../lib/api";
import { isValidRut, normalizeRut } from "../utils/rut";

const passwordRules: { label: string; test: (value: string) => boolean }[] = [
  { label: "Mínimo 8 caracteres", test: (v) => v.length >= 8 },
  { label: "Una letra mayúscula", test: (v) => /[A-Z]/.test(v) },
  { label: "Una letra minúscula", test: (v) => /[a-z]/.test(v) },
  { label: "Un número", test: (v) => /\d/.test(v) },
  { label: "Un carácter especial", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function strengthOf(value: string): { score: number; label: string; level: "weak" | "medium" | "strong" } {
  const score = passwordRules.filter((rule) => rule.test(value)).length;
  if (score <= 2) return { score, label: "Débil", level: "weak" };
  if (score <= 4) return { score, label: "Media", level: "medium" };
  return { score, label: "Fuerte", level: "strong" };
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthView() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirm: "",
  });

  const strength = strengthOf(form.password);
  const rulesPass = passwordRules.every((rule) => rule.test(form.password));
  const confirmOk = form.confirm.length > 0 && form.confirm === form.password;
  const registerValid =
    form.rut.trim() !== "" &&
    isValidRut(form.rut) &&
    form.nombre.trim() !== "" &&
    form.apellido.trim() !== "" &&
    emailRe.test(form.email) &&
    rulesPass &&
    confirmOk;
  const loginValid = emailRe.test(loginForm.email) && loginForm.password.length > 0;

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (mode === "login") {
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
      return;
    }

    if (!registerValid) {
      if (!isValidRut(form.rut)) setError("El RUT ingresado no es válido (formato 12345678-9).");
      else setError("Revisa los campos: correo, contraseña segura y confirmación.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        rut: normalizeRut(form.rut),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setLoginForm({ email: form.email.trim(), password: "" });
      setForm({ rut: "", nombre: "", apellido: "", email: "", password: "", confirm: "" });
      setMode("login");
      setNotice("Cuenta creada como Voluntario(a). Inicia sesión para continuar.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo registrar el usuario.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <img alt="Emblema Bomba España, 10ª Compañía" className="auth-emblem" src={companyLogo} />
          <div className="auth-kicker">CUERPO DE BOMBEROS DE SANTIAGO</div>
          <div className="auth-title">10ª COMPAÑÍA · BOMBA ESPAÑA</div>
          <div className="auth-subtitle">Centro de Mando — Acceso restringido a personal autorizado</div>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            role="tab"
            aria-selected={mode === "login"}
            onClick={() => switchMode("login")}
            type="button"
          >
            Iniciar sesión
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            role="tab"
            aria-selected={mode === "register"}
            onClick={() => switchMode("register")}
            type="button"
          >
            Registrarme
          </button>
        </div>

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
          {mode === "login" ? (
            <>
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
            </>
          ) : (
            <>
              <div className="auth-grid">
                <label htmlFor="reg-rut">
                  RUT
                  <input
                    id="reg-rut"
                    autoComplete="off"
                    placeholder="12345678-9"
                    value={form.rut}
                    onChange={(e) => setForm({ ...form, rut: e.target.value })}
                  />
                </label>
                <label htmlFor="reg-email">
                  CORREO
                  <input
                    id="reg-email"
                    autoComplete="email"
                    placeholder="nombre@bomba10.cl"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>
                <label htmlFor="reg-nombre">
                  NOMBRE
                  <input
                    id="reg-nombre"
                    autoComplete="given-name"
                    placeholder="Ej. Pepe"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                </label>
                <label htmlFor="reg-apellido">
                  APELLIDO
                  <input
                    id="reg-apellido"
                    autoComplete="family-name"
                    placeholder="Ej. Fuego"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                  />
                </label>
              </div>

              <label htmlFor="reg-pass">
                CONTRASEÑA SEGURA
                <input
                  id="reg-pass"
                  autoComplete="new-password"
                  placeholder="Mín. 8, A-Z, a-z, 0-9 y especial"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>

              {form.password.length > 0 && (
                <div className="strength-block">
                  <div className="strength-track" role="meter" aria-label="Fortaleza de la contraseña" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={5}>
                    <div className={`strength-fill ${strength.level}`} style={{ width: `${(strength.score / 5) * 100}%` }} />
                  </div>
                  <span className={`strength-label ${strength.level}`}>{strength.label}</span>
                  <ul className="rule-check">
                    {passwordRules.map((rule) => (
                      <li key={rule.label} className={rule.test(form.password) ? "pass" : "fail"}>
                        <Icon name={rule.test(form.password) ? "check" : "close"} size={13} />
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <label htmlFor="reg-confirm">
                CONFIRMAR CONTRASEÑA
                <input
                  id="reg-confirm"
                  autoComplete="new-password"
                  placeholder="Repite la contraseña"
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                />
              </label>
              {form.confirm.length > 0 && (
                <div className={`confirm-line ${confirmOk ? "pass" : "fail"}`}>
                  <Icon name={confirmOk ? "check" : "close"} size={13} />
                  {confirmOk ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                </div>
              )}

              <div className="auth-hint">
                Tu cuenta se creará con el rol Voluntario(a). Los cargos de oficialía son asignados por la Dirección.
              </div>

              <button
                className="auth-submit"
                disabled={submitting || !registerValid}
                type="submit"
              >
                <Icon name="check" size={16} />
                {submitting ? "Registrando..." : "Crear cuenta"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
