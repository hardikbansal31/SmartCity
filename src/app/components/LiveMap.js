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
import { Polyline } from "react-leaflet";
import AutoCompleteInput from "./AutoCompleteInput";
import Openrouteservice from "openrouteservice-js";

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

export default function LiveMap() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeSummary, setRouteSummary] = useState(null);

  const fetchRoute = async () => {
    try {
      const key =
        "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImEwMTc1NDFiZWRiZjQ2YjA4OGMyNDk1MGM1ZjZhYzBkIiwiaCI6Im11cm11cjY0In0="; // Use your actual key here

      const Geocode = new Openrouteservice.Geocode({ api_key: key });
      const Directions = new Openrouteservice.Directions({ api_key: key });

      // 1. Geocode both places
      const fromData = await Geocode.geocode({ text: from });
      const toData = await Geocode.geocode({ text: to });

      const fromCoords = fromData.features?.[0]?.geometry.coordinates;
      const toCoords = toData.features?.[0]?.geometry.coordinates;

      if (!fromCoords || !toCoords) {
        alert("Could not geocode one of the addresses");
        return;
      }

      // 2. Get directions
      const routeData = await Directions.calculate({
        coordinates: [fromCoords, toCoords],
        profile: "driving-car",
        format: "geojson",
      });

      if (!routeData.features) {
        alert("No route found");
        return;
      }

      const coords = routeData.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );

      const summary = routeData.features[0].properties.summary;

      setRouteCoords(coords);
      setRouteSummary(summary); // has duration, distance
    } catch (err) {
      console.error("Route error:", err);
      alert("Could not fetch route.");
    }
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1000,
            background: "white",
            padding: "12px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            width: "350px",
          }}
        >
          <AutoCompleteInput
            placeholder="From"
            value={from}
            setValue={setFrom}
          />
          <AutoCompleteInput placeholder="To" value={to} setValue={setTo} />
          <button
            onClick={fetchRoute}
            style={{ padding: "8px", cursor: "pointer" }}
          >
            Show Route
          </button>

          {routeSummary && (
            <div style={{ marginTop: "8px", fontSize: "14px" }}>
              <b>Distance:</b> {(routeSummary.distance / 1000).toFixed(2)} km
              <br />
              <b>ETA:</b> {(routeSummary.duration / 60).toFixed(1)} min
            </div>
          )}
        </div>

        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "98vh", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // detectRetina={true}
          />

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
              pathOptions={{
                color: sensor.congestionLevel >= 7 ? "red" : "green",
              }}
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
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
        </MapContainer>
      </div>
    </>
  );
}
