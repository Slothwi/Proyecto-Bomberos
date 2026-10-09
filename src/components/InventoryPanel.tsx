import { useState } from "react";
import type { InventoryItem } from "../types";

export default function InventoryPanel({ initialData }: { initialData: InventoryItem[] }) {
  const [items, setItems] = useState<InventoryItem[]>(initialData);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Vehículo",
    type: "",
    status: "Disponible",
    location: "Cuartel Central",
  });

  const filteredItems = items.filter((item) => {
    if (filterStatus === "todos") return true;
    return item.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    const itemToAdd: InventoryItem = {
      id: `EQ-0${items.length + 1}`,
      ...newItem,
    };
    setItems([itemToAdd, ...items]);
    setShowAddModal(false);
    setNewItem({ name: "", category: "Vehículo", type: "", status: "Disponible", location: "Cuartel Central" });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "disponible":
        return "status-pill stable";
      case "en servicio":
        return "status-pill warning";
      case "mantenimiento":
        return "status-pill warning";
      case "fuera de servicio":
        return "status-pill critical";
      default:
        return "status-pill";
    }
  };

  return (
    <section className="panel" style={{ marginTop: "1.5rem" }}>
      <div className="section-header" style={{ marginBottom: "1rem" }}>
        <div className="section-title-wrap">
          <span className="section-icon">📦</span>
          <div>
            <div className="eyebrow">CONTROL DE RECURSOS</div>
            <div className="section-title">Inventario de Equipos y Vehículos</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* Filtro por estado */}
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

          <button
            type="button"
            className="button primary-button"
            onClick={() => setShowAddModal(true)}
            style={{ fontSize: "0.85rem" }}
          >
            + Registrar equipo
          </button>
        </div>
      </div>

      {/* Tabla de Inventario */}
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
            {filteredItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #21262d" }}>
                <td style={{ padding: "0.75rem", fontWeight: 700, color: "#eab308" }}>{item.id}</td>
                <td style={{ padding: "0.75rem", fontWeight: 600, color: "#f0f6fc" }}>{item.name}</td>
                <td style={{ padding: "0.75rem", color: "#8b949e" }}>{item.category}</td>
                <td style={{ padding: "0.75rem", color: "#c9d1d9" }}>{item.type}</td>
                <td style={{ padding: "0.75rem", color: "#8b949e" }}>{item.location}</td>
                <td style={{ padding: "0.75rem" }}>
                  <span className={getStatusBadgeClass(item.status)}>
                    <span />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para registrar nuevo equipo */}
      {showAddModal && (
        <div className="modal-backdrop" onMouseDown={() => setShowAddModal(false)}>
          <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
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
              <button type="button" className="button secondary-button" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
              <button type="button" className="button primary-button" onClick={handleAddItem}>
                Guardar en inventario
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
