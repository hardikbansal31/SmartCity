"use client"; // This directive is necessary for components that use hooks.

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, // Correctly imported for line charts
  LineElement,  // Correctly imported for line charts
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2"; // Using Line component for line charts

// --- Register Chart.js components ---
// This ensures all the necessary parts for a line chart are available.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format 24-hour time into AM/PM format
const formatHour = (hour) => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

// --- Main Analytics Page Component ---
export default function AnalyticsPage() {
  // --- STATE MANAGEMENT ---
  const [apiData, setApiData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  // --- DATA HANDLING with useEffect ---
  // UPDATED: Restored the original API fetch logic.
  useEffect(() => {
    // This async function will fetch data from your API route.
    const fetchData = async () => {
      try {
        const response = await fetch("/api/chart-data"); // The API endpoint.
        if (!response.ok) {
          // Throw an error if the API response is not successful.
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setApiData(data);
        // Set the default selected location after data is fetched.
        if (data && data.length > 0) {
          setSelectedLocation(data[0].name);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setCurrentDate(new Date().toLocaleString());
  }, []); // The empty dependency array ensures this runs only once.

  // --- DATA DERIVATION & EVENT HANDLERS ---
  const locationData = apiData.find((loc) => loc.name === selectedLocation);
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  // --- LOADING AND ERROR UI ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full p-8 bg-gray-900 text-white">
        Loading Aggregated Traffic Data...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full p-8 bg-gray-900 text-red-500">
        Error: {error}
      </div>
    );
  }

  // --- Chart.js Options for a Line Chart ---
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#A0AEC0" } },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(26, 32, 44, 0.9)",
        titleColor: "#E2E8F0",
        bodyColor: "#CBD5E0",
        borderColor: "#4A5568",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y} (avg)`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: { grid: { color: "#4A5568" }, ticks: { color: "#A0AEC0" } },
      y: {
        grid: { color: "#4A5568" },
        ticks: { color: "#A0AEC0" },
        title: {
          display: true,
          text: "Average Vehicle Count",
          color: "#A0AEC0",
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
  };

  // --- Data Transformation for Chart.js ---
  const chartData = {
    labels: locationData
      ? locationData.data.map((d) => formatHour(d.hour))
      : [],
    datasets: [
      {
        label: "Average Vehicle Count",
        data: locationData ? locationData.data.map((d) => d.vehicle_count) : [],
        borderColor: "rgba(221, 107, 32, 1)", // Changed to orange
        backgroundColor: "rgba(221, 107, 32, 0.2)", // Changed to orange tint
        fill: true,
      },
    ],
  };

  // --- RENDER JSX ---
  return (
    <div className="w-full h-full p-4 sm:p-6 lg:p-8 bg-gray-900 text-white rounded-xl shadow-lg flex flex-col">
      <div className="flex-shrink-0">
        <header className="mb-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hourly Traffic Analysis
          </h1>
        </header>
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <label
            htmlFor="location-select"
            className="font-semibold text-lg text-gray-300"
          >
            Location:
          </label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={handleLocationChange}
            className="w-full sm:w-auto bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5"
          >
            {apiData.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-grow relative w-full min-h-[300px]">
        <Line options={options} data={chartData} />
      </div>

      <footer className="flex-shrink-0 text-center mt-4 text-xs text-gray-400">
        <p>Data updated as of: {currentDate}</p>
      </footer>
    </div>
  );
}