import { useAuth } from "../hooks/useAuth";
import { initialsOf, rolLabelFor } from "../utils/user";
import ThemeToggle from "../components/ThemeToggle";

interface UserProfileProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function UserProfile({ onBack, onLogout }: UserProfileProps) {
  const { session } = useAuth();
  if (!session) return null;

  const { user } = session;
  const fullName = `${user.nombre} ${user.apellido}`.trim();
  const rolLabel = rolLabelFor(user.rol);

  return (
    <div className="app-shell profile-view" style={{ padding: "2rem", minHeight: "100vh" }}>
      <header className="profile-header" style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button 
          type="button" 
          className="button secondary-button" 
          onClick={onBack}
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          ← Volver al Panel Operativo
        </button>
        <div className="profile-actions">
        <ThemeToggle />
        <button
          type="button"
          className="button text-button"
          onClick={onLogout}
          style={{ cursor: "pointer" }}
        >
          Cerrar sesión →
        </button>
        </div>
      </header>

      <main className="panel" style={{ padding: "2.5rem", maxWidth: "900px", margin: "0 auto", borderRadius: "12px" }}>
        {/* Encabezado del Perfil */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #facc15 0%, #eab308 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "2rem",
              color: "#0f172a",
              boxShadow: "0 4px 12px rgba(234, 179, 8, 0.3)",
            }}
          >
            {initialsOf(user.nombre, user.apellido)}
          </div>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0, color: "#f0f6fc" }}>
              {fullName}
            </h1>
            <span style={{ color: "#eab308", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.05em" }}>
              {rolLabel.toUpperCase()} · 10ª COMPAÑÍA "BOMBA ESPAÑA"
            </span>
          </div>
        </div>

        {/* Información de la cuenta (datos reales del backend) */}
        <section style={{ borderTop: "1px solid #30363d", paddingTop: "1.5rem", marginBottom: "2rem", color: "#c9d1d9" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#f0f6fc", marginBottom: "1rem" }}>Cuenta Oficial</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>RUT</span>
              <strong style={{ fontSize: "1rem", color: "#f0f6fc" }}>{user.rut}</strong>
            </div>

            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Correo</span>
              <strong style={{ fontSize: "1rem", color: "#f0f6fc" }}>{user.email}</strong>
            </div>

            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
               <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Rol</span>
              <strong style={{ fontSize: "1rem", color: "#f0f6fc" }}>{rolLabel}</strong>
            </div>

            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Compañía</span>
              <strong style={{ fontSize: "1rem", color: "#f0f6fc" }}>10ª Compañía - Bomba España</strong>
            </div>
          </div>
        </section>

        {/* Información Operativa */}
        <section style={{ borderTop: "1px solid #30363d", paddingTop: "1.5rem", marginBottom: "2rem", color: "#c9d1d9" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#f0f6fc", marginBottom: "1rem" }}>Información Operativa (demo)</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Estado Guardia</span>
              <strong style={{ fontSize: "1rem", color: "#22c55e" }}>● Activo en Servicio</strong>
            </div>

            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Unidad Asignada</span>
              <strong style={{ fontSize: "1rem", color: "#f0f6fc" }}>B-10 / RX-10</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
