import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import truckImg from "../assets/bombero.png";

const fireTruckIcon = L.icon({
  iconUrl: truckImg,
  iconSize: [45, 22],
  iconAnchor: [22, 11],
  popupAnchor: [0, -11],
});

const vehicles = [
  { id: "B-10", name: "Bomba B-10", lat: -33.4489, lng: -70.6693, status: "Operativo", fuel: "92%" },
  { id: "RX-10", name: "Rescate RX-10", lat: -33.4435, lng: -70.6582, status: "En operación", fuel: "78%" },
  { id: "H-10", name: "HazMat H-10", lat: -33.4352, lng: -70.6481, status: "En Cuartel", fuel: "100%" },
];

export default function FleetMap() {
  const centerPosition: [number, number] = [-33.445, -70.66];

  return (
    <div style={{ width: "100%", height: "380px", borderRadius: "12px", overflow: "hidden", border: "1px solid #30363d" }}>
      <MapContainer
        center={centerPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", background: "#1d2127" }}
      >
        {/* Capa de Google Maps 100% libre sin API Key */}
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />

        {vehicles.map((vehicle) => (
          <Marker 
            key={vehicle.id} 
            position={[vehicle.lat, vehicle.lng]}
            icon={fireTruckIcon}
          >
            <Popup>
              <div style={{ color: "#161b22", fontFamily: "sans-serif" }}>
                <strong>{vehicle.name}</strong>
                <br />
                Estado: {vehicle.status}
                <br />
                Combustible: {vehicle.fuel}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}