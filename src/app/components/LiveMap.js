// "use client";
// import "leaflet/dist/leaflet.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   CircleMarker,
// } from "react-leaflet";
// import L from "leaflet";
// import { useEffect, useState } from "react";

// // Mumbai coordinates
// const center = [19.076, 72.8777];

// const placeholderSensors = [
//   {
//     id: 1,
//     name: "Andheri Junction",
//     lat: 19.1197,
//     lng: 72.8468,
//     vehicleCount: 55,
//     avgSpeed: 22,
//     congestionLevel: 8,
//     alert: "Accident",
//   },
//   {
//     id: 2,
//     name: "Marine Drive",
//     lat: 18.943,
//     lng: 72.8235,
//     vehicleCount: 30,
//     avgSpeed: 35,
//     congestionLevel: 3,
//     alert: "",
//   },
//   {
//     id: 3,
//     name: "Bandra West",
//     lat: 19.06,
//     lng: 72.8333,
//     vehicleCount: 70,
//     avgSpeed: 10,
//     congestionLevel: 9,
//     alert: "Crime Reported",
//   },
// ];

// const LiveMap = () => {
//   const [sensors, setSensors] = useState([]);

//   // Fetch live sensor/alert data from backend
//   //   useEffect(() => {
//   //     fetch("/api/sensors") // Or use WebSocket here
//   //       .then((res) => res.json())
//   //       .then((data) => setSensors(data));
//   //   }, []);

//   return (
//     <MapContainer
//       center={center}
//       zoom={13}
//       style={{ height: "98vh", width: "100%" }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {/* data from api */}
//       {/* {sensors.map((sensor) => (
//         <CircleMarker
//           key={sensor.id}
//           center={[sensor.lat, sensor.lng]}
//           radius={10}
//           pathOptions={{ color: sensor.congestionLevel > 7 ? "red" : "green" }}
//         >
//           <Popup>
//             <b>Location:</b> {sensor.name}
//             <br />
//             <b>Vehicles:</b> {sensor.vehicleCount}
//             <br />
//             <b>Speed:</b> {sensor.avgSpeed} km/h
//             <br />
//             <b>Status:</b> {sensor.alert || "Normal"}
//           </Popup>
//         </CircleMarker>
//       ))} */}

//       {/* sample data */}
//       {placeholderSensors.map((sensor) => (
//         <CircleMarker
//           key={sensor.id}
//           center={[sensor.lat, sensor.lng]}
//           radius={10}
//           pathOptions={{ color: sensor.congestionLevel >= 7 ? "red" : "green" }}
//         >
//           <Popup>
//             <strong>{sensor.name}</strong>
//             <br />
//             🚗 Vehicles: {sensor.vehicleCount}
//             <br />
//             🛣 Speed: {sensor.avgSpeed} km/h
//             <br />
//             ⚠️ Alert: {sensor.alert || "None"}
//           </Popup>
//         </CircleMarker>
//       ))}
//     </MapContainer>
//   );
// };

// export default LiveMap;

"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// Mumbai default center
const center = [19.076, 72.8777];

// 🚦 Sample sensor data
const placeholderSensors = [
  {
    id: 1,
    name: "Andheri",
    lat: 19.1197,
    lng: 72.8468,
    vehicleCount: 50,
    avgSpeed: 25,
    congestionLevel: 7,
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

function SearchBox({ setSearchLocation }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x: lng, y: lat, label } = result.location;
      setSearchLocation({ lat, lng, label });
      map.setView([lat, lng], 15); // Optional: zoom in to location
    });

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation");
    };
  }, [map, setSearchLocation]);

  return null;
}

export default function LiveMap() {
  const [searchLocation, setSearchLocation] = useState(null);

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "98vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
      />

      <SearchBox setSearchLocation={setSearchLocation} />

      {/* Marker for searched location */}
      {searchLocation && (
        <Marker position={[searchLocation.lat, searchLocation.lng]}>
          <Popup>
            📍 <strong>{searchLocation.label}</strong>
          </Popup>
        </Marker>
      )}

      {/* Marker for fake congestion sensor */}
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
            ⚠️ Alert: {sensor.alert || "None"}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
