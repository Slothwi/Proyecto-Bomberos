interface UserProfileProps {
  onBack: () => void;
}

export default function UserProfile({ onBack }: UserProfileProps) {
  return (
    <div className="app-shell" style={{ padding: "2rem", minHeight: "100vh" }}>
      <header style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button 
          type="button" 
          className="button secondary-button" 
          onClick={onBack}
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          ← Volver al Panel Operativo
        </button>
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
            AL
          </div>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0, color: "#f0f6fc" }}>
              Alejandro León
            </h1>
            <span style={{ color: "#eab308", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.05em" }}>
              CAPITÁN · 10ª COMPAÑÍA "BOMBA ESPAÑA"
            </span>
          </div>
        </div>

        {/* Información Operativa */}
        <section style={{ borderTop: "1px solid #30363d", paddingTop: "1.5rem", marginBottom: "2rem", color: "#c9d1d9" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#f0f6fc", marginBottom: "1rem" }}>Información Operativa</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Cargo / Rango</span>
              <strong style={{ fontSize: "1rem", color: "#f0f6fc" }}>Capitán de Compañía</strong>
            </div>

            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Compañía</span>
              <strong style={{ fontSize: "1rem", color: "#f0f6fc" }}>10ª Compañía - Bomba España</strong>
            </div>

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

        {/* Datos Personales y Médicos (Nuevos campos agregados) */}
        <section style={{ borderTop: "1px solid #30363d", paddingTop: "1.5rem", color: "#c9d1d9" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#f0f6fc", marginBottom: "1rem" }}>Datos Personales y de Emergencia</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Teléfono de Contacto</span>
              <strong style={{ fontSize: "1rem", color: "#f0f6fc" }}>+56 9 8765 4321</strong>
            </div>

            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Dirección Particular</span>
              <strong style={{ fontSize: "1rem", color: "#f0f6fc" }}>Av. España 1230, Santiago</strong>
            </div>

            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Tipo de Sangre</span>
              <strong style={{ fontSize: "1rem", color: "#ef4444" }}>O RH+</strong>
            </div>

            <div style={{ background: "#161b22", padding: "1rem", borderRadius: "8px", border: "1px solid #30363d" }}>
              <span style={{ fontSize: "0.8rem", color: "#8b949e", display: "block" }}>Alergias Conocidas</span>
              <strong style={{ fontSize: "1rem", color: "#f59e0b" }}>Penicilina (Alergia Médica)</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}