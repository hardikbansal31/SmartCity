"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import Openrouteservice from "openrouteservice-js";

import AutoCompleteInput from "../AutoCompleteInput";
import useTrafficSocket from "../useTrafficSocket";
import "./LiveMap.css"; // We'll reuse the CSS from the previous step

// Fallback center for Mumbai
const defaultCenter = [19.076, 72.8777];

// Custom animated icon for user's location
const userLocationIcon = new L.divIcon({
  html: `<div class="user-location-dot"></div><div class="user-location-halo"></div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to handle dynamic map effects
function MapEffect({ userLocation, routeCoords, isNavigating }) {
  const map = useMap();

  useEffect(() => {
    // 1. If navigating, follow the user and zoom in close
    if (isNavigating && userLocation) {
      map.flyTo(userLocation, 16, {
        duration: 1, // Make the pan smoother
      });
    }
    // 2. If a new route is shown (and not yet navigating), fit it to the screen
    else if (routeCoords && routeCoords.length > 0) {
      map.fitBounds(routeCoords, { padding: [50, 50] });
    }
    // 3. On initial load, fly to user's location
    else if (userLocation) {
      map.flyTo(userLocation, 14);
    }
  }, [userLocation, routeCoords, isNavigating, map]);

  return null;
}

function LocateUserButton({ userLocation }) {
  const map = useMap();

  const handleLocate = () => {
    if (userLocation) {
      // Fly to the user's location with a high zoom level
      map.flyTo(userLocation, 16);
    } else {
      alert("User location not available.");
    }
  };

  return (
    <button
      onClick={handleLocate}
      className="locate-button"
      title="Recenter on my location"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="20"
        height="20"
      >
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
      </svg>
    </button>
  );
}

function getAlertColor(alert) {
  switch (alert) {
    case "Jam":
      return "red";
    case "Accident":
      return "orange";
    case "Diversion":
      return "blue";
    default:
      return "green"; // "None" or unknown
  }
}

export default function LiveMap2() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeSummary, setRouteSummary] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // A ref to hold the ID of the location watcher
  const watchIdRef = useRef(null);

  // Get user's initial location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        // Set the "From" field to "My Location" by default
        setFrom("My Location");
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert(
          "Could not get your location. Please enter a starting point manually."
        );
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Hook for traffic data
  useTrafficSocket((newEntry) => {
    setSensorData((prev) => {
      const id = `${newEntry.place}-${newEntry.latitude}-${newEntry.longitude}`;
      if (prev.some((e) => e.id === id)) return prev;
      return [...prev, { ...newEntry, id }];
    });
  });

  // Function to start continuously watching the user's position
  const startNavigation = () => {
    setIsNavigating(true);
    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Error watching position:", error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Function to stop watching the user's position
  const stopNavigation = () => {
    setIsNavigating(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    // Clear the route from the map
    setRouteCoords([]);
    setRouteSummary(null);
  };

  const handleGetDirections = async () => {
    try {
      if (!from || !to) {
        alert("Please specify a 'From' and 'To' location.");
        return;
      }

      const key =
        "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImEwMTc1NDFiZWRiZjQ2YjA4OGMyNDk1MGM1ZjZhYzBkIiwiaCI6Im11cm11cjY0In0="; // ⚠️ Replace with your key
      const orsGeocode = new Openrouteservice.Geocode({ api_key: key });
      const orsDirections = new Openrouteservice.Directions({ api_key: key });

      let fromCoords;
      // Use user's live location if "My Location" is selected
      if (from === "My Location" && userLocation) {
        fromCoords = [userLocation[1], userLocation[0]]; // ORS needs [lng, lat]
      } else {
        const fromData = await orsGeocode.geocode({ text: from });
        fromCoords = fromData.features?.[0]?.geometry.coordinates;
      }

      const toData = await orsGeocode.geocode({ text: to });
      const toCoords = toData.features?.[0]?.geometry.coordinates;

      if (!fromCoords || !toCoords) {
        alert("Could not find the location for one of the addresses.");
        return;
      }

      const routeData = await orsDirections.calculate({
        coordinates: [fromCoords, toCoords],
        profile: "driving-car",
        format: "geojson",
      });

      if (!routeData.features) {
        alert("No route found between these locations.");
        return;
      }

      const coords = routeData.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );
      const summary = routeData.features[0].properties.summary;

      setRouteCoords(coords);
      setRouteSummary(summary);

      // ** Start navigation mode after fetching the route **
      startNavigation();
    } catch (err) {
      console.error("Route error:", err);
      alert("Could not fetch the route. Check the console for details.");
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* --- UI Panel --- */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: "#1B1B1B",
          color: "white",
          padding: "12px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          width: "350px",
        }}
      >
        <AutoCompleteInput placeholder="From" value={from} setValue={setFrom} />
        <AutoCompleteInput placeholder="To" value={to} setValue={setTo} />

        {!isNavigating ? (
          <button
            onClick={handleGetDirections}
            className="action-button primary"
          >
            Get Directions
          </button>
        ) : (
          <button onClick={stopNavigation} className="action-button secondary">
            Stop Navigation
          </button>
        )}

        {routeSummary && (
          <div style={{ marginTop: "8px", fontSize: "14px" }}>
            <b>Distance:</b> {(routeSummary.distance / 1000).toFixed(2)} km
            <br />
            <b>ETA:</b> {(routeSummary.duration / 60).toFixed(1)} min
          </div>
        )}
      </div>

      {/* --- Map Container --- */}
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: "90vh", width: "83.5vw" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEffect
          userLocation={userLocation}
          routeCoords={routeCoords}
          isNavigating={isNavigating}
        />

        <LocateUserButton userLocation={userLocation} />

        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* {sensorData.map((sensor) => (
          <CircleMarker
            key={sensor.id}
            center={[sensor.latitude, sensor.longitude]}
          ></CircleMarker>
        ))} */}

        {sensorData.map((sensor) => (
          <CircleMarker
            key={sensor.id}
            center={[sensor.latitude, sensor.longitude]}
            radius={8}
            pathOptions={{
              color: getAlertColor(sensor.alert),
              fillColor: getAlertColor(sensor.alert),
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div>
                <b>{sensor.place}</b> <br />
                Alert: {sensor.alert} <br />
                Vehicles: {sensor.vehicle_count} <br />
                Density: {sensor.vehicle_density.toFixed(1)}% <br />
                Flow: {sensor.traffic_flow.toFixed(1)} km/h <br />
                Time: {sensor.time}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="#3471eb" weight={5} />
        )}
      </MapContainer>
    </div>
  );
}
