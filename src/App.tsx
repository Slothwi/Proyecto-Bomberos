import { FormEvent, ReactNode, useState } from "react";
import companyLogo from "./assets/logo-bomberos.png";
import DotacionView from "./DotacionView";
import UserProfile from "./UserProfile";
import FleetMap from "./FleetMap";

type IconName =
  | "alert"
  | "arrow"
  | "bell"
  | "calendar"
  | "check"
  | "clock"
  | "close"
  | "fire"
  | "helmet"
  | "location"
  | "menu"
  | "plus"
  | "radio"
  | "search"
  | "shield"
  | "spark"
  | "truck"
  | "users";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    alert: (
      <>
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.3 3.6 2.4 17.2A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.8L13.7 3.6a2 2 0 0 0-3.4 0Z" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    fire: (
      <path d="M12 22c4.4 0 7-3.1 7-7.1 0-2.3-1.1-4.8-3.4-7.4.1 2.1-.8 3.4-2 4.1.2-3.4-1.8-6.9-5-9.6.2 3.4-3.6 6.1-3.6 11.9C5 18.4 7.7 22 12 22Zm0-2.4c-1.7 0-3-1.3-3-3 0-1.4.8-2.6 2.3-4.2.1 1.2.7 2 1.5 2.5.5-.7.8-1.5.8-2.4 1 1.3 1.5 2.5 1.5 3.8 0 1.9-1.3 3.3-3.1 3.3Z" />
    ),
    helmet: (
      <>
        <path d="M4 14a8 8 0 0 1 16 0" />
        <path d="M2 14h20v3H2zM9 7v7M15 7v7" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    plus: <path d="M12 5v14M5 12h14" />,
    radio: (
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    shield: <path d="M12 22S20 18 20 11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />,
    spark: (
      <path d="m12 3-1.1 4.2A5.2 5.2 0 0 1 7.2 11L3 12l4.2 1.1a5.2 5.2 0 0 1 3.7 3.7L12 21l1.1-4.2a5.2 5.2 0 0 1 3.7-3.7L21 12l-4.2-1a5.2 5.2 0 0 1-3.7-3.8Z" />
    ),
    truck: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <path d="M5 10h6M8 7v6" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 1 0 7.8" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}

function Emblem({ watermark = false }: { watermark?: boolean }) {
  return (
    <svg
      aria-hidden={watermark ? "true" : undefined}
      aria-label={watermark ? undefined : "Emblema oficial Bomba España, 10ª Compañía"}
      className={watermark ? "watermark" : "emblem"}
      role={watermark ? undefined : "img"}
      viewBox="0 0 500 500"
    >
      <image
        height="500"
        href={companyLogo}
        preserveAspectRatio="xMidYMid meet"
        width="500"
      />
    </svg>
  );
}

function Button({
  children,
  className = "",
  onClick,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button className={`button ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

function Panel({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section className={`panel ${className}`} style={style}>
      {children}
    </section>
  );
}

function SectionHeader({
  action,
  eyebrow,
  icon,
  title,
}: {
  action?: ReactNode;
  eyebrow?: string;
  icon: IconName;
  title: string;
}) {
  return (
    <div className="section-header">
      <div className="section-title-wrap">
        <span className="section-icon">
          <Icon name={icon} />
        </span>
        <div>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <div className="section-title">{title}</div>
        </div>
      </div>
      {action}
    </div>
  );
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  type: string;
  status: string;
  location: string;
}

const incidents = [
  {
    code: "10-0-1",
    title: "Fuego estructural",
    address: "Av. España 1480, Santiago",
    time: "08:42",
    unit: "B-10",
    level: "Alarma activa",
    tone: "critical",
  },
  {
    code: "10-3-1",
    title: "Rescate vehicular",
    address: "Ruta 5 / Enlace Toesca",
    time: "07:18",
    unit: "RX-10",
    level: "En operación",
    tone: "warning",
  },
  {
    code: "10-6-1",
    title: "Materiales peligrosos",
    address: "Sector Industrial Norte",
    time: "06:55",
    unit: "H-10",
    level: "Controlado",
    tone: "stable",
  },
];

const initialInventory: InventoryItem[] = [
  { id: "EQ-01", name: "Bomba B-10", category: "Vehículo", type: "Carro Bomba 4.000L", status: "Disponible", location: "Cuartel Central" },
  { id: "EQ-02", name: "Rescate RX-10", category: "Vehículo", type: "Rescate Pesado", status: "En servicio", location: "Ruta 5 / Toesca" },
  { id: "EQ-03", name: "HazMat H-10", category: "Vehículo", type: "Materiales Peligrosos", status: "Disponible", location: "Cuartel Central" },
  { id: "EQ-04", name: "Equipos ERA (x14)", category: "Equipamiento", type: "Respiración Autónoma", status: "Disponible", location: "Pañol de Equipos" },
  { id: "EQ-05", name: "Equipos ERA (x2)", category: "Equipamiento", type: "Respiración Autónoma", status: "Mantenimiento", location: "Taller Central" },
  { id: "EQ-06", name: "Traje Estructural #12", category: "EPI", type: "Protección Personal", status: "Fuera de servicio", location: "Bodega" },
];

const crew = [
  { initials: "FM", name: "Felipe Muñoz", role: "Teniente 1°", certifications: ["Rescate Urbano", "Mando"] },
  { initials: "CV", name: "Catalina Vera", role: "Maquinista", certifications: ["Operador B-10", "HazMat"] },
  { initials: "JR", name: "Javier Rojas", role: "Voluntario", certifications: ["Rescate Urbano"] },
  { initials: "AS", name: "Antonia Silva", role: "Voluntaria", certifications: ["APH", "HazMat"] },
];

export default function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "dotacion" | "perfil">("dashboard");
  const [query, setQuery] = useState("");
  const [aiMessage, setAiMessage] = useState("¿En qué puedo asistir al mando?");
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [notice, setNotice] = useState("");
  
  const [incidentsList, setIncidentsList] = useState(incidents);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(initialInventory);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [showAddInventory, setShowAddInventory] = useState(false);

  const [newIncident, setNewIncident] = useState({
    code: "",
    title: "",
    address: "",
    unit: "B-10",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Vehículo",
    type: "",
    status: "Disponible",
    location: "Cuartel Central",
  });

  if (currentView === "dotacion") {
    return <DotacionView onBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "perfil") {
    return <UserProfile onBack={() => setCurrentView("dashboard")} />;
  }

  const handleCreateIncident = () => {
    if (!newIncident.code.trim() || !newIncident.address.trim()) return;

    setIncidentsList((prev) => [
      {
        code: newIncident.code,
        title: newIncident.title || "Emergencia despachada",
        address: newIncident.address,
        time: newIncident.time,
        unit: newIncident.unit,
        level: "En operación",
        tone: "critical",
      },
      ...prev,
    ]);

    setShowNewIncident(false);
    setNotice("Emergencia registrada e ingresada al historial");

    setNewIncident({
      code: "",
      title: "",
      address: "",
      unit: "B-10",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  };

  const handleAddInventory = () => {
    if (!newItem.name.trim()) return;

    const added: InventoryItem = {
      id: `EQ-0${inventoryList.length + 1}`,
      ...newItem,
    };

    setInventoryList([added, ...inventoryList]);
    setShowAddInventory(false);
    setNotice("Recurso añadido al inventario");
    setNewItem({ name: "", category: "Vehículo", type: "", status: "Disponible", location: "Cuartel Central" });
  };

  const filteredInventory = inventoryList.filter((item) => {
    if (filterStatus === "todos") return true;
    return item.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const askAi = (prompt?: string) => {
    const next = prompt || query.trim();
    if (!next) return;
    setAiMessage(`Solicitud en análisis: “${next}”`);
    setQuery("");
    setNotice("IA Operativa procesando consulta");
    window.setTimeout(() => setNotice(""), 2400);
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    askAi();
  };

  return (
    <div className="app-shell">
      <Emblem watermark />

      <header className="topbar">
        <div className="brand">
          <Emblem />
          <div className="brand-copy">
            <div className="brand-kicker">CUERPO DE BOMBEROS DE SANTIAGO</div>
            <div className="brand-name">10ª COMPAÑÍA</div>
            <div className="brand-subtitle">BOMBA ESPAÑA · FUNDADA EN 1892</div>
          </div>
        </div>

        <form className="global-search" onSubmit={submitSearch}>
          <Icon name="search" />
          <input
            aria-label="Preguntar a IA Operativa"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Preguntar a IA Operativa..."
            value={query}
          />
          <Button className="ai-search-button" type="submit">
            <Icon name="spark" size={16} />
            <span>Consultar IA</span>
          </Button>
        </form>

        <div className="header-actions">
          <Button className="icon-button" onClick={() => setNotice("No hay alertas nuevas")}>
            <Icon name="bell" />
            <span className="notification-dot" />
          </Button>
          <div 
            className="user-profile" 
            onClick={() => setCurrentView("perfil")}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <div className="avatar">AL</div>
            <div className="user-copy">
              <span className="user-name">Alejandro León</span>
              <span className="role-badge"><span /> Capitán</span>
            </div>
          </div>
          <Button className="mobile-menu"><Icon name="menu" /></Button>
        </div>
      </header>

      <main className="dashboard">
        <div className="command-strip">
          <div>
            <div className="page-kicker"><span className="live-dot" /> CENTRO DE MANDO EN LÍNEA</div>
            <div className="page-title">Panel Operativo</div>
            <div className="page-subtitle">Estado general de la compañía y coordinación de emergencias.</div>
          </div>
          <div className="command-meta">
            <div className="date-chip"><Icon name="calendar" size={16} /> Martes, 18 Jun 2025</div>
            <div className="time-block">
              <strong>09:46</strong>
              <span>CLST · SANTIAGO</span>
            </div>
          </div>
        </div>

        <Panel className="ai-hub">
          <div className="ai-orb"><Icon name="spark" size={25} /></div>
          <div className="ai-copy">
            <div className="ai-label">IA OPERATIVA <span>ACTIVA</span></div>
            <div className="ai-title">{aiMessage}</div>
            <div className="ai-description">Consulta recursos, dotación e historial operativo en tiempo real.</div>
          </div>
          <div className="quick-actions">
            <Button onClick={() => askAi("Resumen de emergencias del mes")}>
              <Icon name="fire" size={16} /> Resumen de emergencias del mes
            </Button>
            <Button onClick={() => askAi("Personal disponible para rescate")}>
              <Icon name="users" size={16} /> Personal disponible para rescate
            </Button>
            <Button onClick={() => askAi("Sugerir parte de guardia")}>
              <Icon name="spark" size={16} /> Sugerir parte de guardia
            </Button>
          </div>
        </Panel>

        <div className="metrics-row">
          <div className="metric">
            <span className="metric-icon critical"><Icon name="fire" /></span>
            <div><span>Emergencias activas</span><strong>03</strong></div>
            <span className="metric-trend critical-text">+1 última hora</span>
          </div>
          <div className="metric">
            <span className="metric-icon gold"><Icon name="truck" /></span>
            <div><span>Unidades disponibles</span><strong>04<small>/ 05</small></strong></div>
            <span className="metric-trend">80% operatividad</span>
          </div>
          <div className="metric">
            <span className="metric-icon green"><Icon name="users" /></span>
            <div><span>Personal de guardia</span><strong>18</strong></div>
            <span className="metric-trend">Dotación completa</span>
          </div>
          <div className="metric">
            <span className="metric-icon blue"><Icon name="clock" /></span>
            <div><span>Tiempo medio respuesta</span><strong>05:24</strong></div>
            <span className="metric-trend green-text">− 00:18 este mes</span>
          </div>
        </div>

        <div className="content-grid" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* 1. GESTIÓN DE EMERGENCIAS */}
          <Panel className="incidents-panel">
            <SectionHeader
              action={
                <Button className="primary-button" onClick={() => setShowNewIncident(true)}>
                  <Icon name="plus" size={16} /> Nueva emergencia
                </Button>
              }
              eyebrow="EN TIEMPO REAL"
              icon="radio"
              title="Gestión de emergencias"
            />
            <div className="incident-head">
              <span>INCIDENTE / UBICACIÓN</span><span>DESPACHO</span><span>UNIDAD</span><span>ESTADO</span>
            </div>
            <div className="incident-list">
              {incidentsList.map((incident) => (
                <div className="incident-row" key={`${incident.code}-${incident.time}`}>
                  <div className="incident-main">
                    <span className={`incident-mark ${incident.tone}`}><Icon name="alert" size={16} /></span>
                    <div>
                      <div className="incident-title"><span>{incident.code}</span>{incident.title}</div>
                      <div className="incident-location"><Icon name="location" size={13} />{incident.address}</div>
                    </div>
                  </div>
                  <div className="dispatch-time"><strong>{incident.time}</strong><span>hoy</span></div>
                  <div className="unit-tag">{incident.unit}</div>
                  <div className={`status-pill ${incident.tone}`}><span />{incident.level}</div>
                  <Button className="row-arrow" onClick={() => setNotice(`Abriendo incidente ${incident.code}`)}>
                    <Icon name="arrow" size={16} />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="panel-footer" onClick={() => setNotice("Historial operativo actualizado")}>
              Ver historial de emergencias <Icon name="arrow" size={15} />
            </Button>
          </Panel>

          {/* 2. UBICACIÓN DE FLOTA Y EQUIPAMIENTO (CON MAPA A LA IZQUIERDA) */}
          <Panel className="fleet-panel">
            <SectionHeader
              action={<span className="summary-tag"><span /> 4 de 5 operativas</span>}
              icon="truck"
              title="Ubicación de Flota y Equipamiento"
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>
              <div>
                <FleetMap />
              </div>

              <div className="fleet-list">
                <div className="vehicle-card">
                  <div className="vehicle-visual"><Icon name="truck" size={36} /><span>B-10</span></div>
                  <div className="vehicle-copy"><strong>Bomba B-10</strong><span>Carro bomba · 4.000 L</span></div>
                  <div className="fleet-status"><span className="status-pill stable"><span />Operativo</span><small>Combustible 92%</small></div>
                </div>

                <div className="vehicle-card">
                  <div className="vehicle-visual"><Icon name="truck" size={36} /><span>RX-10</span></div>
                  <div className="vehicle-copy"><strong>Rescate RX-10</strong><span>Rescate pesado</span></div>
                  <div className="fleet-status"><span className="status-pill stable"><span />Operativo</span><small>Combustible 78%</small></div>
                </div>

                <div className="equipment-card">
                  <div className="equipment-icon"><Icon name="shield" /></div>
                  <div><strong>Equipos ERA</strong><span>14 unidades disponibles</span></div>
                  <span className="status-pill warning"><span />2 en mantención</span>
                </div>

                <div className="equipment-card">
                  <div className="equipment-icon"><Icon name="helmet" /></div>
                  <div><strong>Trajes estructurales</strong><span>21 equipos registrados</span></div>
                  <span className="status-pill critical"><span />1 fuera de servicio</span>
                </div>
              </div>
            </div>
          </Panel>

          {/* 3. INVENTARIO DE EQUIPOS Y VEHÍCULOS */}
          <Panel className="inventory-panel">
            <div className="section-header" style={{ marginBottom: "1rem" }}>
              <div className="section-title-wrap">
                <span className="section-icon"><Icon name="shield" /></span>
                <div>
                  <div className="eyebrow">CONTROL DE RECURSOS</div>
                  <div className="section-title">Inventario de Equipos y Vehículos</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    background: "#161b22",
                    color: "#c9d1d9",
                    border: "1px solid #30363d",
                    borderRadius: "6px",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="disponible">Disponibles</option>
                  <option value="en servicio">En servicio</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="fuera de servicio">Fuera de servicio</option>
                </select>

                <Button className="primary-button" onClick={() => setShowAddInventory(true)}>
                  <Icon name="plus" size={16} /> Registrar equipo
                </Button>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #30363d", color: "#8b949e", fontSize: "0.8rem" }}>
                    <th style={{ padding: "0.75rem" }}>CÓDIGO</th>
                    <th style={{ padding: "0.75rem" }}>NOMBRE / RECURSO</th>
                    <th style={{ padding: "0.75rem" }}>CATEGORÍA</th>
                    <th style={{ padding: "0.75rem" }}>TIPO / ESPECIFICACIÓN</th>
                    <th style={{ padding: "0.75rem" }}>UBICACIÓN</th>
                    <th style={{ padding: "0.75rem" }}>ESTADO / DISPONIBILIDAD</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #21262d" }}>
                      <td style={{ padding: "0.75rem", fontWeight: 700, color: "#eab308" }}>{item.id}</td>
                      <td style={{ padding: "0.75rem", fontWeight: 600, color: "#f0f6fc" }}>{item.name}</td>
                      <td style={{ padding: "0.75rem", color: "#8b949e" }}>{item.category}</td>
                      <td style={{ padding: "0.75rem", color: "#c9d1d9" }}>{item.type}</td>
                      <td style={{ padding: "0.75rem", color: "#8b949e" }}>{item.location}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <span className={`status-pill ${item.status === 'Disponible' ? 'stable' : item.status === 'Fuera de servicio' ? 'critical' : 'warning'}`}>
                          <span />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* 4. PERSONAL Y GUARDIA */}
          <Panel className="personnel-panel">
            <SectionHeader
              action={
                <Button className="text-button" onClick={() => setCurrentView("dotacion")}>
                  Ver dotación <Icon name="arrow" size={14} />
                </Button>
              }
              eyebrow="TURNO A · 08:00 — 20:00"
              icon="users"
              title="Personal y guardia"
            />
            <div className="shift-summary">
              <div className="shift-ring"><strong>18</strong><span>ACTIVOS</span></div>
              <div className="shift-bars">
                <div><span><b>Oficiales</b><small>4 / 4</small></span><i><em className="full" /></i></div>
                <div><span><b>Voluntarios</b><small>10 / 12</small></span><i><em className="mostly" /></i></div>
                <div><span><b>Maquinistas</b><small>4 / 4</small></span><i><em className="full" /></i></div>
              </div>
              <div className="coverage"><span>COBERTURA</span><strong>90%</strong><small>Guardia 24/7</small></div>
            </div>
            <div className="crew-list">
              {crew.map((member, index) => (
                <div className="crew-row" key={member.name}>
                  <div className={`crew-avatar crew-${index}`}>{member.initials}<span /></div>
                  <div className="crew-identity"><strong>{member.name}</strong><span>{member.role}</span></div>
                  <div className="certifications">
                    {member.certifications.map((cert) => <span key={cert}>{cert}</span>)}
                  </div>
                  <span className="available"><Icon name="check" size={12} /> Disponible</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </main>

      {/* MODAL REGISTRAR EMERGENCIA */}
      {showNewIncident && (
        <div className="modal-backdrop" onMouseDown={() => setShowNewIncident(false)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-icon"><Icon name="alert" size={24} /></div>
            <div className="modal-title">Registrar emergencia</div>
            <div className="modal-copy">Inicia un nuevo despacho operativo y alerta a la central.</div>
            
            <label>
              CLAVE DE EMERGENCIA
              <input 
                autoFocus 
                placeholder="Ej. 10-0-1" 
                value={newIncident.code}
                onChange={(e) => setNewIncident({ ...newIncident, code: e.target.value })}
              />
            </label>

            <label>
              TÍTULO / TIPO DE INCIDENTE
              <input 
                placeholder="Ej. Fuego estructural" 
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
              />
            </label>

            <label>
              UBICACIÓN
              <input 
                placeholder="Dirección o referencia" 
                value={newIncident.address}
                onChange={(e) => setNewIncident({ ...newIncident, address: e.target.value })}
              />
            </label>

            <label>
              UNIDAD ASIGNADA
              <input 
                placeholder="Ej. B-10" 
                value={newIncident.unit}
                onChange={(e) => setNewIncident({ ...newIncident, unit: e.target.value })}
              />
            </label>

            <div className="modal-actions">
              <Button className="secondary-button" onClick={() => setShowNewIncident(false)}>Cancelar</Button>
              <Button className="primary-button" onClick={handleCreateIncident}>
                <Icon name="radio" size={16} /> Activar despacho
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* MODAL REGISTRAR INVENTARIO */}
      {showAddInventory && (
        <div className="modal-backdrop" onMouseDown={() => setShowAddInventory(false)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-title">Registrar nuevo recurso</div>
            <div className="modal-copy">Ingresa un nuevo equipo o vehículo al inventario operativo.</div>

            <label>
              NOMBRE DEL EQUIPO O VEHÍCULO
              <input
                autoFocus
                placeholder="Ej. Carro Aljibes Z-10"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </label>

            <label>
              CATEGORÍA
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                style={{ width: "100%", padding: "0.6rem", background: "#0d1117", border: "1px solid #30363d", color: "#fff", borderRadius: "6px" }}
              >
                <option value="Vehículo">Vehículo</option>
                <option value="Equipamiento">Equipamiento ERA / Rescate</option>
                <option value="EPI">EPI (Protección Personal)</option>
                <option value="Comunicaciones">Comunicaciones / Radio</option>
              </select>
            </label>

            <label>
              DESCRIPCIÓN / TIPO
              <input
                placeholder="Ej. Cisterna 10.000L"
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              />
            </label>

            <label>
              UBICACIÓN
              <input
                placeholder="Ej. Cuartel Central"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              />
            </label>

            <label>
              ESTADO INICIAL
              <select
                value={newItem.status}
                onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                style={{ width: "100%", padding: "0.6rem", background: "#0d1117", border: "1px solid #30363d", color: "#fff", borderRadius: "6px" }}
              >
                <option value="Disponible">Disponible</option>
                <option value="En servicio">En servicio</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Fuera de servicio">Fuera de servicio</option>
              </select>
            </label>

            <div className="modal-actions">
              <Button className="secondary-button" onClick={() => setShowAddInventory(false)}>
                Cancelar
              </Button>
              <Button className="primary-button" onClick={handleAddInventory}>
                Guardar en inventario
              </Button>
            </div>
          </section>
        </div>
      )}

      {notice && <div className="toast"><Icon name="check" size={16} />{notice}</div>}
    </div>
  );
}