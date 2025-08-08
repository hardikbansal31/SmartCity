import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function TrafficFeed({ apiBase = "https://ieee-hazard-analyzer-latest.onrender.com" }) {
  const [activeTab, setActiveTab] = useState("reports");

  const [reports, setReports] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load Montserrat font dynamically (Google Fonts)
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [reportsRes, hazardsRes, alertsRes] = await Promise.all([
        axios.get(`${apiBase}/mongo/report-analyzer`),
        axios.get(`${apiBase}/mongo/hazard-detection`),
        axios.get(`${apiBase}/local-alerts`),
      ]);
      setReports(reportsRes.data || []);
      setHazards(hazardsRes.data || []);
      setAlerts(alertsRes.data || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  function TabButton({ id, label }) {
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`px-3 py-2 rounded-md font-semibold transition-all focus:outline-none font-montserrat
          ${active ? "bg-orange-500 text-black" : "bg-transparent text-orange-300 hover:bg-orange-700/40"}`}
      >
        {label}
      </button>
    );
  }

  function Card({ children, title }) {
    return (
      <motion.div
        className="bg-gray-900 rounded-lg p-4 shadow-lg font-montserrat"
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-orange-400 font-bold">{title}</h3>
        <div className="mt-2 text-gray-300 text-sm">{children}</div>
      </motion.div>
    );
  }

  function ListView() {
    if (loading) return <div className="text-gray-400 font-montserrat">Loading...</div>;
    if (error) return <div className="text-red-400 font-montserrat">Error: {error}</div>;

    if (activeTab === "reports")
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => (
            <Card
              key={r._id}
              title={`Threat: ${r.threatLevel?.join(", ") || "N/A"}`}
            >
              <p className="mb-1"><span className="font-semibold">Status:</span> {r.status}</p>
              <p className="mb-1"><span className="font-semibold">Location:</span> {r.location || "—"}</p>
              <p className="mb-1"><span className="font-semibold">Services:</span> {r.servicesRequired?.join(", ") || "—"}</p>
              <p className="mt-2 text-sm">{r.describe}</p>
              <p className="mt-2 text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      );

    if (activeTab === "hazards")
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hazards.map((h) => (
            <Card
              key={h._id}
              title={`Danger: ${h.dangerLevel || "N/A"}`}
            >
              <p className="mb-1"><span className="font-semibold">Status:</span> {h.status}</p>
              <p className="mb-1"><span className="font-semibold">Location:</span> {h.location || "—"}</p>
              <p className="mb-1"><span className="font-semibold">Traffic:</span> {h.trafficCondition || "—"}</p>
              <p className="mb-1"><span className="font-semibold">Emergency Services:</span> {h.emergencyServicesRequired?.join(", ") || "—"}</p>
              <p className="mt-2 text-sm">{h.additionalNotes}</p>
              <p className="mt-2 text-xs text-gray-500">{new Date(h.createdAt).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      );

    if (activeTab === "alerts")
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.map((a) => (
            <Card
              key={a._id}
              title={a.message}
            >
              <p className="mb-1 text-sm">{a.description}</p>
              <p className="mt-2 text-xs text-gray-400"><span className="font-semibold">When:</span> {new Date(a.date).toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-400"><span className="font-semibold">Where:</span> {a.location}</p>
            </Card>
          ))}
        </div>
      );

    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-black text-white font-montserrat">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-500">Safety Dashboard</h1>
            <p className="text-sm text-gray-400">View Reports • Hazards • Local Alerts</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-900 rounded p-1">
              <TabButton id="reports" label="Reports" />
              <TabButton id="hazards" label="Hazards" />
              <TabButton id="alerts" label="Local Alerts" />
            </div>

            <button onClick={fetchAll} className="px-3 py-2 rounded bg-gray-800 font-montserrat">Refresh</button>
          </div>
        </header>

        <main>
          <ListView />
        </main>

        <footer className="mt-8 text-xs text-gray-500">
          API Base: <span className="text-orange-400">{apiBase}</span>
        </footer>
      </div>

      <style jsx global>{`
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </div>
  );
}
