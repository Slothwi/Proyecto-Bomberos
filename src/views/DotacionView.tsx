import { useEffect, useState, type FormEvent } from "react";
import { Emblem, Icon } from "../components/Icon";
import type { Firefighter } from "../types";
import { useAuth } from "../hooks/useAuth";
import { ApiError, deleteUsuario, getUsuarios, updateUsuario, type UsuarioRow } from "../lib/api";
import { isValidRut, normalizeRut } from "../utils/rut";
import { rolLabelFor } from "../utils/user";
import ThemeToggle from "../components/ThemeToggle";

function toFirefighter(u: UsuarioRow): Firefighter {
  return {
    id: String(u.id),
    rut: u.rut,
    email: u.email,
    name: `${u.nombre} ${u.apellido}`.trim(),
    roleCode: u.rol,
    role: rolLabelFor(u.rol),
    shift: u.turno ?? "Sin turno",
    certifications: u.certificaciones,
    status: u.estado,
  };
}

// Reglas y nivel de fuerza para contraseñas 
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

export default function DotacionView({ onBack }: { onBack: () => void }) {
  const { session, register } = useAuth();

  const currentUser = session?.user;
  const userRole = currentUser?.rol?.toUpperCase() || "";
  const isAuthorized = userRole === "CAPITAN" || userRole === "ADMINISTRATIVO" || userRole === "CAPITÁN";

  const [list, setList] = useState<Firefighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [filterShift, setFilterShift] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<Firefighter | null>(null);
  const [editForm, setEditForm] = useState({ nombre: "", apellido: "", email: "", role: "VOLUNTARIO", shift: "", certifications: "", status: "Disponible" });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Formulario con campos completos de usuario
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirm: "",
    role: "Voluntario",
    shift: "Turno A (Diurno)",
    certifications: "",
    status: "Disponible",
  });

  // La dotación se lee desde la BD (GET /api/usuarios), no de mocks
  useEffect(() => {
    let alive = true;
    setLoading(true);
    getUsuarios()
      .then((rows) => {
        if (!alive) return;
        setList(rows.map(toFirefighter));
        setLoadError("");
      })
      .catch((err) => {
        if (alive) setLoadError(err instanceof ApiError ? err.message : "No se pudo cargar la dotación desde el servidor.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [session]);

  // Validadores de contraseña y formulario
  const strength = strengthOf(form.password);
  const rulesPass = passwordRules.every((rule) => rule.test(form.password));
  const confirmOk = form.confirm.length > 0 && form.confirm === form.password;
  
  const isFormValid =
    form.rut.trim() !== "" &&
    isValidRut(form.rut) &&
    form.nombre.trim() !== "" &&
    form.apellido.trim() !== "" &&
    emailRe.test(form.email) &&
    rulesPass &&
    confirmOk;

  // Manejo del registro completo conectando backend (register) y lista local
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      if (!isValidRut(form.rut)) setError("El RUT ingresado no es válido (ej: 12345678-9).");
      else setError("Revisa que los campos obligatorios, la contraseña segura y la confirmación coincidan.");
      return;
    }

    setSubmitting(true);

    try {
      const certsArray = form.certifications
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      // 1. Alta real en el backend con TODOS los campos que soporta el modelo Usuario
      const { user } = await register({
        rut: normalizeRut(form.rut),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        password: form.password,
        rol: form.role,
        turno: form.shift,
        certificaciones: certsArray.length > 0 ? certsArray : ["Estructural Base"],
        estado: form.status,
      });

      // 2. La fila mostrada se construye desde la respuesta del backend (fuente de verdad)
      setList((prev) => [toFirefighter(user), ...prev]);
      setShowModal(false);
      setNotice(`Bombero(a) ${user.nombre} ${user.apellido} registrado(a) en la dotación`);

      // Limpiar formulario
      setForm({
        rut: "",
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirm: "",
        role: "Voluntario",
        shift: "Turno A (Diurno)",
        certifications: "",
        status: "Disponible",
      });

      setTimeout(() => setNotice(""), 3500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al registrar bombero en la base de datos.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = list.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase());
    const matchesShift = filterShift === "Todos" || item.shift === filterShift;
    return matchesSearch && matchesShift;
  });

  const openEdit = (person: Firefighter) => {
    const [nombre, ...apellidoParts] = person.name.split(" ");
    setEditing(person);
    setEditForm({
      nombre,
      apellido: apellidoParts.join(" "),
      email: person.email ?? "",
      role: person.roleCode ?? "VOLUNTARIO",
      shift: person.shift === "Sin turno" ? "" : person.shift,
      certifications: person.certifications.join(", "),
      status: person.status,
    });
    setError("");
  };

  const handleEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    setEditSubmitting(true);
    setError("");
    try {
      const { user } = await updateUsuario(Number(editing.id), {
        nombre: editForm.nombre.trim(),
        apellido: editForm.apellido.trim(),
        email: editForm.email.trim(),
        rol: editForm.role,
        turno: editForm.shift.trim(),
        certificaciones: editForm.certifications.split(",").map((value) => value.trim()).filter(Boolean),
        estado: editForm.status,
      });
      setList((current) => current.map((item) => item.id === editing.id ? toFirefighter(user) : item));
      setEditing(null);
      setNotice(`Datos de ${user.nombre} ${user.apellido} actualizados`);
      setTimeout(() => setNotice(""), 3500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar el bombero.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar a ${editing.name} del registro? Esta acción es irreversible y se perderán sus datos.`,
    );
    if (!confirmed) return;

    setEditSubmitting(true);
    setError("");
    try {
      await deleteUsuario(Number(editing.id));
      setList((current) => current.filter((item) => item.id !== editing.id));
      setEditing(null);
      setNotice(`${editing.name} fue eliminado del registro`);
      setTimeout(() => setNotice(""), 3500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar el bombero.");
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="app-shell dotacion-view" style={{ position: "relative", minHeight: "100vh", backgroundColor: "#0b0d12" }}>
      <Emblem />

      <main className="dashboard" style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Enlace de regreso */}
        <div className="dotacion-toolbar">
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
        <ThemeToggle />
        </div>

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

          {isAuthorized && (
            <button
              className="primary-button"
              onClick={() => {
                setError("");
                setShowModal(true);
              }}
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
          )}
        </div>

        {/* Barra de Filtro y Búsqueda */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 300px" }}>
            <span style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#6e7681" }}>
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre o rol..."
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

        {/* Estado de carga desde el backend */}
        {loading && (
          <div style={{ marginBottom: "1rem", color: "#8b949e", fontSize: "0.875rem" }}>Cargando dotación desde el servidor…</div>
        )}
        {loadError && !loading && (
          <div className="auth-alert error" style={{ marginBottom: "1rem" }}>
            <Icon name="close" size={15} /> {loadError}
          </div>
        )}

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
                  {isAuthorized && <th style={{ padding: "1rem 1.25rem" }}>ACCIONES</th>}
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
                    {isAuthorized && (
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <button className="secondary-button" onClick={() => openEdit(person)} type="button">
                          Editar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={isAuthorized ? 5 : 4} style={{ padding: "3rem", textAlign: "center", color: "#8b949e" }}>
                      No se encontraron integrantes en la dotación con ese criterio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal para Agregar nuevo Bombero */}
      {showModal && isAuthorized && (
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
            overflowY: "auto",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "#161b22",
              borderRadius: "0.75rem",
              padding: "1.75rem",
              maxWidth: "520px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
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

            {/* Alerta de Error */}
            {error && (
              <div className="auth-alert error" style={{ marginBottom: "1rem" }}>
                <Icon name="close" size={15} /> {error}
              </div>
            )}

            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1rem" }} noValidate>
              
              {/* RUT Y CORREO */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8b949e", marginBottom: "0.35rem" }}>
                    RUT
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="12345678-9"
                    value={form.rut}
                    onChange={(e) => setForm({ ...form, rut: e.target.value })}
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
                    CORREO
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="nombre@bomba10.cl"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              </div>

              {/* NOMBRE Y APELLIDO */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8b949e", marginBottom: "0.35rem" }}>
                    NOMBRE
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ej. Pepe"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                    APELLIDO
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ej. Fuego"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
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
              </div>

              {/* CARGO Y TURNO */}
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
                    <option value="Administrativo">Administrativo</option>
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

              {/* CONTRASEÑA SEGURA */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8b949e", marginBottom: "0.35rem" }}>
                  CONTRASEÑA SEGURA
                </label>
                <input
                  required
                  type="password"
                  placeholder="Mín. 8, A-Z, a-z, 0-9 y especial"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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

              {/* BARRA Y REGLAS DE FORTALEZA DE CONTRASEÑA */}
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

              {/* CONFIRMAR CONTRASEÑA */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8b949e", marginBottom: "0.35rem" }}>
                  CONFIRMAR CONTRASEÑA
                </label>
                <input
                  required
                  type="password"
                  placeholder="Repite la contraseña"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
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
              {form.confirm.length > 0 && (
                <div className={`confirm-line ${confirmOk ? "pass" : "fail"}`}>
                  <Icon name={confirmOk ? "check" : "close"} size={13} />
                  {confirmOk ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                </div>
              )}

              {/* CERTIFICACIONES */}
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

              {/* ESTADO INICIAL */}
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

              {/* BOTONES DE ACCIÓN */}
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
                  disabled={submitting || !isFormValid}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.375rem",
                    border: "none",
                    backgroundColor: "#e53e3e",
                    color: "#ffffff",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    opacity: submitting || !isFormValid ? 0.6 : 1,
                  }}
                >
                  {submitting ? "Registrando..." : "Guardar Bombero"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editing && isAuthorized && (
        <div className="personnel-edit-backdrop" onClick={() => setEditing(null)}>
          <form className="personnel-edit-modal" onClick={(event) => event.stopPropagation()} onSubmit={handleEdit}>
            <div className="personnel-edit-heading">
              <div>
                <div className="eyebrow">GESTIÓN DE PERSONAL</div>
                <h2>Editar bombero</h2>
              </div>
              <button className="icon-button" onClick={() => setEditing(null)} type="button"><Icon name="close" size={18} /></button>
            </div>
            {error && <div className="auth-alert error"><Icon name="close" size={15} /> {error}</div>}
            <div className="personnel-edit-grid">
              <label>Nombre<input required value={editForm.nombre} onChange={(event) => setEditForm({ ...editForm, nombre: event.target.value })} /></label>
              <label>Apellido<input required value={editForm.apellido} onChange={(event) => setEditForm({ ...editForm, apellido: event.target.value })} /></label>
              <label>Correo<input required type="email" value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} /></label>
              <label>Rol
                <select value={editForm.role} onChange={(event) => setEditForm({ ...editForm, role: event.target.value })}>
                  <option value="CAPITAN">Capitán</option>
                  <option value="OFICIAL">Oficial</option>
                  <option value="MAQUINISTA">Maquinista</option>
                  <option value="ADMINISTRATIVO">Administrativo</option>
                  <option value="VOLUNTARIO">Voluntario</option>
                </select>
              </label>
              <label>Turno<input value={editForm.shift} onChange={(event) => setEditForm({ ...editForm, shift: event.target.value })} /></label>
              <label className="personnel-edit-wide">Certificaciones<input value={editForm.certifications} onChange={(event) => setEditForm({ ...editForm, certifications: event.target.value })} placeholder="Separadas por coma" /></label>
              <label>Estado
                <select value={editForm.status} onChange={(event) => setEditForm({ ...editForm, status: event.target.value })}>
                  <option>Disponible</option>
                  <option>En Servicio</option>
                  <option>Licencia</option>
                  <option>Inactivo</option>
                </select>
              </label>
            </div>
            <div className="personnel-edit-actions">
              <button className="danger-button" disabled={editSubmitting} onClick={handleDelete} type="button">Eliminar registro</button>
              <button className="secondary-button" onClick={() => setEditing(null)} type="button">Cancelar</button>
              <button className="primary-button" disabled={editSubmitting} type="submit">{editSubmitting ? "Guardando..." : "Guardar cambios"}</button>
            </div>
          </form>
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
