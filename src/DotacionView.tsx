import { FormEvent, ReactNode, useState } from "react";
import companyLogo from "./assets/logo-bomberos.png";

export interface Firefighter {
  id: string;
  name: string;
  role: "Capitán" | "Teniente 1°" | "Teniente 2°" | "Maquinista" | "Voluntario";
  shift: "Turno A (Diurno)" | "Turno B (Nocturno)" | "Guardia Nocturna" | "Franco";
  certifications: string[];
  status: "Disponible" | "En Servicio" | "Licencia";
}

const initialFirefighters: Firefighter[] = [
  {
    id: "1",
    name: "Felipe Muñoz",
    role: "Teniente 1°",
    shift: "Turno A (Diurno)",
    certifications: ["Rescate Urbano", "Mando", "APH"],
    status: "Disponible",
  },
  {
    id: "2",
    name: "Catalina Vera",
    role: "Maquinista",
    shift: "Turno A (Diurno)",
    certifications: ["Operador B-10", "HazMat Level II"],
    status: "Disponible",
  },
  {
    id: "3",
    name: "Javier Rojas",
    role: "Voluntario",
    shift: "Guardia Nocturna",
    certifications: ["Rescate Urbano"],
    status: "En Servicio",
  },
  {
    id: "4",
    name: "Antonia Silva",
    role: "Voluntario",
    shift: "Turno B (Nocturno)",
    certifications: ["APH", "HazMat"],
    status: "Disponible",
  },
];

type IconName = "plus" | "search" | "users" | "check" | "close" | "arrow" | "shield";

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    arrow: <path d="m15 18-6-6 6-6" />,
    shield: <path d="M12 22S20 18 20 11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />,
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}

function Emblem() {
  return (
    <svg
      aria-hidden="true"
      className="watermark"
      viewBox="0 0 500 500"
    >
      <defs>
        <filter id="remove-white-watermark" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                   -1 -1 -1 0 3"
          />
        </filter>
      </defs>
      <image
        filter="url(#remove-white-watermark)"
        height="500"
        href={companyLogo}
        preserveAspectRatio="xMidYMid meet"
        width="500"
      />
    </svg>
  );
}

export default function DotacionView({ onBack }: { onBack: () => void }) {
  const [list, setList] = useState<Firefighter[]>(initialFirefighters);
  const [search, setSearch] = useState("");
  const [filterShift, setFilterShift] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    name: "",
    role: "Voluntario",
    shift: "Turno A (Diurno)",
    certifications: "",
    status: "Disponible",
  });

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const certsArray = form.certifications
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const newMember: Firefighter = {
      id: Date.now().toString(),
      name: form.name.trim(),
      role: form.role as any,
      shift: form.shift as any,
      certifications: certsArray.length > 0 ? certsArray : ["Estructural Base"],
      status: form.status as any,
    };

    setList([newMember, ...list]);
    setShowModal(false);
    setForm({
      name: "",
      role: "Voluntario",
      shift: "Turno A (Diurno)",
      certifications: "",
      status: "Disponible",
    });

    setNotice(`Bombero(a) ${newMember.name} ingresado(a) correctamente`);
    setTimeout(() => setNotice(""), 3000);
  };

  const filtered = list.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase());
    const matchesShift = filterShift === "Todos" || item.shift === filterShift;
    return matchesSearch && matchesShift;
  });

  return (
    <div className="app-shell" style={{ position: "relative", minHeight: "100vh", backgroundColor: "#0b0d12" }}>
      <Emblem />

      <main className="dashboard" style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Enlace de regreso */}
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#8b949e",
            cursor: "pointer",
            marginBottom: "1.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <Icon name="arrow" size={14} /> Volver al Dashboard
        </button>

        {/* Encabezado Principal */}
        <div className="command-strip" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="page-kicker" style={{ color: "#22c55e", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span className="live-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
              DOTACIÓN Y OPERACIONES
            </div>
            <div className="page-title" style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f0f6fc", marginTop: "0.2rem" }}>
              Dotación de Personal y Guardia
            </div>
            <div className="page-subtitle" style={{ color: "#8b949e", fontSize: "0.9rem", marginTop: "0.2rem" }}>
              Gestión activa de bomberos, maquinistas y oficiales de turno.
            </div>
          </div>

          <button
            className="primary-button"
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#e53e3e",
              color: "#ffffff",
              border: "none",
              padding: "0.7rem 1.2rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 12px rgba(229, 62, 62, 0.25)",
            }}
          >
            <Icon name="plus" size={16} />
            <span>Agregar Bombero</span>
          </button>
        </div>

        {/* Barra de Filtro y Búsqueda */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 300px" }}>
            <span style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#6e7681" }}>
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre o cargo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 1rem 0.65rem 2.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #30363d",
                backgroundColor: "#161b22",
                color: "#f0f6fc",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>

          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #30363d",
              backgroundColor: "#161b22",
              color: "#f0f6fc",
              fontSize: "0.875rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="Todos">Todos los Turnos</option>
            <option value="Turno A (Diurno)">Turno A (Diurno)</option>
            <option value="Turno B (Nocturno)">Turno B (Nocturno)</option>
            <option value="Guardia Nocturna">Guardia Nocturna</option>
            <option value="Franco">Franco</option>
          </select>
        </div>

        {/* Panel de Tabla de Personal */}
        <div
          className="panel"
          style={{
            backgroundColor: "rgba(22, 27, 34, 0.85)",
            borderRadius: "0.75rem",
            border: "1px solid #30363d",
            overflow: "hidden",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #30363d", backgroundColor: "rgba(13, 17, 23, 0.7)", color: "#8b949e", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "1rem 1.25rem" }}>BOMBERO / CARGO</th>
                  <th style={{ padding: "1rem 1.25rem" }}>TURNO ASIGNADO</th>
                  <th style={{ padding: "1rem 1.25rem" }}>CERTIFICACIONES</th>
                  <th style={{ padding: "1rem 1.25rem" }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((person) => (
                  <tr key={person.id} style={{ borderBottom: "1px solid #21262d", transition: "background-color 0.15s ease" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontWeight: 600, color: "#f0f6fc", fontSize: "0.95rem" }}>{person.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#8b949e", marginTop: "0.1rem" }}>{person.role}</div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#c9d1d9" }}>{person.shift}</td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {person.certifications.map((cert) => (
                          <span
                            key={cert}
                            style={{
                              backgroundColor: "#21262d",
                              border: "1px solid #30363d",
                              fontSize: "0.75rem",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "0.375rem",
                              color: "#e6edf3",
                            }}
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "2rem",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor:
                            person.status === "Disponible"
                              ? "rgba(35, 134, 54, 0.15)"
                              : person.status === "En Servicio"
                              ? "rgba(210, 153, 34, 0.15)"
                              : "rgba(110, 118, 129, 0.15)",
                          color:
                            person.status === "Disponible"
                              ? "#3fb950"
                              : person.status === "En Servicio"
                              ? "#d29922"
                              : "#8b949e",
                          border: `1px solid ${
                            person.status === "Disponible"
                              ? "rgba(63, 185, 80, 0.3)"
                              : person.status === "En Servicio"
                              ? "rgba(210, 153, 34, 0.3)"
                              : "rgba(139, 148, 158, 0.3)"
                          }`,
                        }}
                      >
                        <span style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor:
                            person.status === "Disponible"
                              ? "#3fb950"
                              : person.status === "En Servicio"
                              ? "#d29922"
                              : "#8b949e"
                        }} />
                        {person.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "#8b949e" }}>
                      No se encontraron integrantes en la dotación con ese criterio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal para Agregar Nuevo Bombero */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(1, 4, 9, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "#161b22",
              borderRadius: "0.75rem",
              padding: "1.75rem",
              maxWidth: "480px",
              width: "100%",
              border: "1px solid #30363d",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#e53e3e" }}><Icon name="shield" size={20} /></span>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#f0f6fc" }}>
                  Ingresar Nuevo Bombero
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer", padding: "0.2rem" }}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8b949e", marginBottom: "0.35rem" }}>
                  NOMBRE COMPLETO
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Constanza Morales"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #30363d",
                    backgroundColor: "#0d1117",
                    color: "#f0f6fc",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8b949e", marginBottom: "0.35rem" }}>
                    CARGO
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #30363d",
                      backgroundColor: "#0d1117",
                      color: "#f0f6fc",
                      fontSize: "0.875rem",
                      outline: "none",
                    }}
                  >
                    <option value="Voluntario">Voluntario</option>
                    <option value="Maquinista">Maquinista</option>
                    <option value="Teniente 1°">Teniente 1°</option>
                    <option value="Teniente 2°">Teniente 2°</option>
                    <option value="Capitán">Capitán</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8b949e", marginBottom: "0.35rem" }}>
                    TURNO
                  </label>
                  <select
                    value={form.shift}
                    onChange={(e) => setForm({ ...form, shift: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #30363d",
                      backgroundColor: "#0d1117",
                      color: "#f0f6fc",
                      fontSize: "0.875rem",
                      outline: "none",
                    }}
                  >
                    <option value="Turno A (Diurno)">Turno A (Diurno)</option>
                    <option value="Turno B (Nocturno)">Turno B (Nocturno)</option>
                    <option value="Guardia Nocturna">Guardia Nocturna</option>
                    <option value="Franco">Franco</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8b949e", marginBottom: "0.35rem" }}>
                  CERTIFICACIONES (Separadas por coma)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Rescate Urbano, HazMat, APH"
                  value={form.certifications}
                  onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #30363d",
                    backgroundColor: "#0d1117",
                    color: "#f0f6fc",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8b949e", marginBottom: "0.35rem" }}>
                  ESTADO INICIAL
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #30363d",
                    backgroundColor: "#0d1117",
                    color: "#f0f6fc",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En Servicio">En Servicio</option>
                  <option value="Licencia">Licencia</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #30363d",
                    backgroundColor: "transparent",
                    color: "#c9d1d9",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.375rem",
                    border: "none",
                    backgroundColor: "#e53e3e",
                    color: "#ffffff",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notificación Toast */}
      {notice && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            backgroundColor: "#238636",
            color: "#ffffff",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            zIndex: 100,
          }}
        >
          <Icon name="check" size={16} /> {notice}
        </div>
      )}
    </div>
  );
}