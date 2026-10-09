import { useState, type FormEvent } from "react";
import { Emblem, Icon } from "../components/Icon";
import { Button, Panel, SectionHeader } from "../components/ui";
import FleetMap from "../components/FleetMap";
import { crew, incidents, initialInventory } from "../data/mocks";
import { useAuth } from "../hooks/useAuth";
import type { Incident, InventoryItem, ViewName } from "../types";
import { initialsOf, rolLabelFor } from "../utils/user";

interface DashboardViewProps {
  onNavigate: (view: ViewName) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const { session } = useAuth();
  const [query, setQuery] = useState("");
  const [aiMessage, setAiMessage] = useState("¿En qué puedo asistir al mando?");
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [notice, setNotice] = useState("");

  const [incidentsList, setIncidentsList] = useState<Incident[]>(incidents);
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

  if (!session) return null;

  const fullName = `${session.user.nombre} ${session.user.apellido ?? ""}`.trim();
  const initials = initialsOf(session.user.nombre, session.user.apellido ?? "");
  const rolLabel = rolLabelFor(session.user.rol);

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
            onClick={() => onNavigate("perfil")}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <div className="avatar">{initials}</div>
            <div className="user-copy">
              <span className="user-name">{fullName}</span>
              <span className="role-badge"><span /> {rolLabel}</span>
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
                <Button className="text-button" onClick={() => onNavigate("dotacion")}>
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
