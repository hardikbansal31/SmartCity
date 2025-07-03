"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Mumbai coordinates
const center = [19.076, 72.8777];

const placeholderSensors = [
  {
    id: 1,
    name: "Andheri Junction",
    lat: 19.1197,
    lng: 72.8468,
    vehicleCount: 55,
    avgSpeed: 22,
    congestionLevel: 8,
    alert: "Accident",
  },
  {
    id: 2,
    name: "Marine Drive",
    lat: 18.943,
    lng: 72.8235,
    vehicleCount: 30,
    avgSpeed: 35,
    congestionLevel: 3,
    alert: "",
  },
  {
    id: 3,
    name: "Bandra West",
    lat: 19.06,
    lng: 72.8333,
    vehicleCount: 70,
    avgSpeed: 10,
    congestionLevel: 9,
    alert: "Crime Reported",
  },
];

const LiveMap = () => {
  const [sensors, setSensors] = useState([]);

  // Fetch live sensor/alert data from backend
//   useEffect(() => {
//     fetch("/api/sensors") // Or use WebSocket here
//       .then((res) => res.json())
//       .then((data) => setSensors(data));
//   }, []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "98vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* {sensors.map((sensor) => (
        <CircleMarker
          key={sensor.id}
          center={[sensor.lat, sensor.lng]}
          radius={10}
          pathOptions={{ color: sensor.congestionLevel > 7 ? "red" : "green" }}
        >
          <Popup>
            <b>Location:</b> {sensor.name}
            <br />
            <b>Vehicles:</b> {sensor.vehicleCount}
            <br />
            <b>Speed:</b> {sensor.avgSpeed} km/h
            <br />
            <b>Status:</b> {sensor.alert || "Normal"}
          </Popup>
        </CircleMarker>
      ))} */}
      {placeholderSensors.map((sensor) => (
        <CircleMarker
          key={sensor.id}
          center={[sensor.lat, sensor.lng]}
          radius={10}
          pathOptions={{ color: sensor.congestionLevel >= 7 ? "red" : "green" }}
        >
          <Popup>
            <strong>{sensor.name}</strong>
            <br />
            🚗 Vehicles: {sensor.vehicleCount}
            <br />
            🛣 Speed: {sensor.avgSpeed} km/h
            <br />
            ⚠️ Alert: {sensor.alert || "None"}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default LiveMap;
