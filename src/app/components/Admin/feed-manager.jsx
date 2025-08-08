import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

/*
  SafetyDashboard.jsx
  Single-file React component (Tailwind + black/orange theme)

  Features:
  - View, Create, Edit, Delete for Reports, Hazards, and Local Alerts
  - Uses provided backend endpoints
  - Responsive grid, modal forms, confirm dialog
  - Optimized UX: avoid full refresh after create/edit/delete — updates local state instead
  - Keep modal open option for rapid entry

  Notes:
  - Requires tailwindcss in your app
  - Install dependencies: axios, framer-motion
    npm i axios framer-motion
*/

export default function FeedManager({ apiBase = "https://ieee-hazard-analyzer-latest.onrender.com" }) {
  const [activeTab, setActiveTab] = useState("reports");

  // Data stores
  const [reports, setReports] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create' | 'edit'
  const [entityType, setEntityType] = useState("report"); // 'report' | 'hazard' | 'alert'
  const [formData, setFormData] = useState({});

  // Save state & keep-open toggle
  const [saving, setSaving] = useState(false);
  const [keepOpenAfterSave, setKeepOpenAfterSave] = useState(true);

  // Confirm delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
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
      setError((err?.response?.data?.message) || err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  // ------- CRUD Actions (genericized) -------
  const endpoints = {
    report: {
      list: `${apiBase}/mongo/report-analyzer`,
      create: `${apiBase}/mongo/report-analyzer`,
      update: (id) => `${apiBase}/mongo/report-analyzer/${id}`,
      delete: (id) => `${apiBase}/mongo/report-analyzer/${id}`,
      recent: `${apiBase}/mongo/report-analyzer/recent`,
    },
    hazard: {
      list: `${apiBase}/mongo/hazard-detection`,
      create: `${apiBase}/mongo/hazard-detection`,
      update: (id) => `${apiBase}/mongo/hazard-detection/${id}`,
      delete: (id) => `${apiBase}/mongo/hazard-detection/${id}`,
      recent: `${apiBase}/mongo/hazard-detection/recent`,
    },
    alert: {
      list: `${apiBase}/local-alerts`,
      create: `${apiBase}/local-alerts`,
      update: (id) => `${apiBase}/local-alerts/${id}`,
      delete: (id) => `${apiBase}/local-alerts/${id}`,
    },
  };

  // Create returns created resource (does NOT refetch everything)
  async function createEntity(type, data) {
    try {
      const url = endpoints[type].create;
      const res = await axios.post(url, data);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Update updates local state with response
  async function updateEntity(type, id, data) {
    try {
      const url = endpoints[type].update(id);
      const res = await axios.put(url, data);
      const updated = res.data;

      if (type === 'report') setReports(prev => prev.map(p => (p._id === id ? updated : p)));
      if (type === 'hazard') setHazards(prev => prev.map(h => (h._id === id ? updated : h)));
      if (type === 'alert') setAlerts(prev => prev.map(a => (a._id === id ? updated : a)));

      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Delete updates local state
  async function deleteEntity(type, id) {
    try {
      const url = endpoints[type].delete(id);
      await axios.delete(url);

      if (type === 'report') setReports(prev => prev.filter(p => p._id !== id));
      if (type === 'hazard') setHazards(prev => prev.filter(h => h._id !== id));
      if (type === 'alert') setAlerts(prev => prev.filter(a => a._id !== id));

      return { success: true };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // ------- Helpers for forms -------
  function openCreate(type) {
    setEntityType(type);
    setFormMode("create");
    setFormData(getEmptyForm(type));
    setIsFormOpen(true);
  }

  function openEdit(type, item) {
    setEntityType(type);
    setFormMode("edit");
    setFormData(normalizeForForm(type, item));
    setIsFormOpen(true);
  }

  function getEmptyForm(type) {
    if (type === "report")
      return {
        status: "true",
        threatLevel: "",
        servicesRequired: "",
        location: "",
        describe: "",
      };

    if (type === "hazard")
      return {
        status: "safe",
        emergencyServicesRequired: "",
        trafficCondition: "",
        dangerLevel: "low",
        detectedHazards: "",
        location: "",
        additionalNotes: "",
      };

    if (type === "alert")
      return {
        message: "",
        description: "",
        date: new Date().toISOString().slice(0, 16), // for input type datetime-local
        location: "",
      };

    return {};
  }

  function normalizeForForm(type, item) {
    if (!item) return getEmptyForm(type);
    if (type === "report")
      return {
        _id: item._id,
        status: item.status || "true",
        threatLevel: Array.isArray(item.threatLevel)
          ? item.threatLevel.join(", ")
          : item.threatLevel || "",
        servicesRequired: Array.isArray(item.servicesRequired)
          ? item.servicesRequired.join(", ")
          : item.servicesRequired || "",
        location: item.location || "",
        describe: item.describe || "",
      };

    if (type === "hazard")
      return {
        _id: item._id,
        status: item.status || "safe",
        emergencyServicesRequired: Array.isArray(item.emergencyServicesRequired)
          ? item.emergencyServicesRequired.join(", ")
          : item.emergencyServicesRequired || "",
        trafficCondition: item.trafficCondition || "",
        dangerLevel: item.dangerLevel || "low",
        detectedHazards: Array.isArray(item.detectedHazards)
          ? item.detectedHazards.join(", ")
          : item.detectedHazards || "",
        location: item.location || "",
        additionalNotes: item.additionalNotes || "",
      };

    if (type === "alert")
      return {
        _id: item._id,
        message: item.message || "",
        description: item.description || "",
        date: item.date ? new Date(item.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        location: item.location || "",
      };

    return { ...item };
  }

  function denormalizeFromForm(type, values) {
    if (type === "report")
      return {
        status: values.status,
        threatLevel: values.threatLevel
          ? values.threatLevel.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        servicesRequired: values.servicesRequired
          ? values.servicesRequired.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        location: values.location,
        describe: values.describe,
      };

    if (type === "hazard")
      return {
        status: values.status,
        emergencyServicesRequired: values.emergencyServicesRequired
          ? values.emergencyServicesRequired.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        trafficCondition: values.trafficCondition,
        dangerLevel: values.dangerLevel,
        detectedHazards: values.detectedHazards
          ? values.detectedHazards.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        location: values.location,
        additionalNotes: values.additionalNotes,
      };

    if (type === "alert")
      return {
        message: values.message,
        description: values.description,
        date: new Date(values.date).toISOString(),
        location: values.location,
      };

    return values;
  }

  // Submit now does an in-place update of local state to avoid re-fetch and modal flicker
  async function submitForm(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = denormalizeFromForm(entityType, formData);

      if (formMode === "create") {
        const created = await createEntity(entityType, payload);

        // Insert new item locally at top
        if (entityType === 'report') setReports(prev => [created, ...prev]);
        if (entityType === 'hazard') setHazards(prev => [created, ...prev]);
        if (entityType === 'alert') setAlerts(prev => [created, ...prev]);

        if (keepOpenAfterSave) {
          setFormData(getEmptyForm(entityType));
        } else {
          setIsFormOpen(false);
        }

      } else if (formMode === "edit") {
        await updateEntity(entityType, formData._id, payload);
        setIsFormOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save: " + (err?.response?.data?.message || err.message || err));
    } finally {
      setSaving(false);
    }
  }

  // delete flow
  function askDelete(type, item) {
    setToDelete({ type, item });
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await deleteEntity(toDelete.type, toDelete.item._id);
      setConfirmOpen(false);
      setToDelete(null);
    } catch (err) {
      alert("Delete failed: " + (err?.response?.data?.message || err.message));
    }
  }

  // UI components
  function TabButton({ id, label }) {
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`px-3 py-2 rounded-md font-semibold transition-all focus:outline-none 
          ${active ? "bg-orange-500 text-black" : "bg-transparent text-orange-300 hover:bg-orange-700/40"}`}
      >
        {label}
      </button>
    );
  }

  function Card({ children, title, actions }) {
    return (
      <motion.div
        className="bg-gray-900 border border-orange-600 rounded-lg p-4 shadow-md"
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-orange-400 font-bold">{title}</h3>
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
        <div className="mt-2 text-gray-300 text-sm">{children}</div>
      </motion.div>
    );
  }

  function ListView() {
    if (loading) return <div className="text-gray-400">Loading...</div>;
    if (error) return <div className="text-red-400">Error: {error}</div>;

    if (activeTab === "reports")
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => (
            <Card
              key={r._id}
              title={`Threat: ${r.threatLevel?.join(", ") || "N/A"}`}
              actions={
                <>
                  <button className="text-sm px-2 py-1 rounded bg-orange-600/80" onClick={() => openEdit("report", r)}>
                    Edit
                  </button>
                  <button className="text-sm px-2 py-1 rounded bg-red-600/80" onClick={() => askDelete("report", r)}>
                    Delete
                  </button>
                </>
              }
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
              actions={
                <>
                  <button className="text-sm px-2 py-1 rounded bg-orange-600/80" onClick={() => openEdit("hazard", h)}>
                    Edit
                  </button>
                  <button className="text-sm px-2 py-1 rounded bg-red-600/80" onClick={() => askDelete("hazard", h)}>
                    Delete
                  </button>
                </>
              }
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
              actions={
                <>
                  <button className="text-sm px-2 py-1 rounded bg-orange-600/80" onClick={() => openEdit("alert", a)}>
                    Edit
                  </button>
                  <button className="text-sm px-2 py-1 rounded bg-red-600/80" onClick={() => askDelete("alert", a)}>
                    Delete
                  </button>
                </>
              }
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

  // Form JSX
  function FormModal() {
    if (!isFormOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={() => setIsFormOpen(false)} />
        <motion.div className="relative w-full max-w-2xl p-6 bg-gray-900 border border-orange-600 rounded-lg z-10" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h2 className="text-xl font-bold text-orange-400 mb-4">{formMode === "create" ? "Create" : "Edit"} {entityType}</h2>
          <form onSubmit={submitForm} className="space-y-3">
            {/* Report form */}
            {entityType === "report" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="flex flex-col text-sm">
                    Status
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600">
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  </label>

                  <label className="flex flex-col text-sm">
                    Threat Levels (comma separated)
                    <input value={formData.threatLevel || ""} onChange={(e) => setFormData({ ...formData, threatLevel: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" />
                  </label>
                </div>

                <label className="flex flex-col text-sm">
                  Services Required (comma separated)
                  <input value={formData.servicesRequired || ""} onChange={(e) => setFormData({ ...formData, servicesRequired: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" />
                </label>

                <label className="flex flex-col text-sm">
                  Location
                  <input value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" />
                </label>

                <label className="flex flex-col text-sm">
                  Description
                  <textarea value={formData.describe || ""} onChange={(e) => setFormData({ ...formData, describe: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600 h-28 resize-y" />
                </label>
              </>
            )}

            {/* Hazard form */}
            {entityType === "hazard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="flex flex-col text-sm">
                    Status
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600">
                      <option value="safe">safe</option>
                      <option value="hazard_detected">hazard_detected</option>
                    </select>
                  </label>

                  <label className="flex flex-col text-sm">
                    Danger Level
                    <select value={formData.dangerLevel} onChange={(e) => setFormData({ ...formData, dangerLevel: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600">
                      <option value="low">low</option>
                      <option value="moderate">moderate</option>
                      <option value="high">high</option>
                      <option value="critical">critical</option>
                    </select>
                  </label>
                </div>

                <label className="flex flex-col text-sm">
                  Emergency Services Required (comma separated)
                  <input value={formData.emergencyServicesRequired || ""} onChange={(e) => setFormData({ ...formData, emergencyServicesRequired: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" />
                </label>

                <label className="flex flex-col text-sm">
                  Detected Hazards (comma separated)
                  <input value={formData.detectedHazards || ""} onChange={(e) => setFormData({ ...formData, detectedHazards: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" />
                </label>

                <label className="flex flex-col text-sm">
                  Traffic Condition
                  <input value={formData.trafficCondition || ""} onChange={(e) => setFormData({ ...formData, trafficCondition: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" />
                </label>

                <label className="flex flex-col text-sm">
                  Location
                  <input value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" />
                </label>

                <label className="flex flex-col text-sm">
                  Additional Notes
                  <textarea value={formData.additionalNotes || ""} onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600 h-28 resize-y" />
                </label>
              </>
            )}

            {/* Alert form */}
            {entityType === "alert" && (
              <>
                <label className="flex flex-col text-sm">
                  Message
                  <input value={formData.message || ""} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" required />
                </label>

                <label className="flex flex-col text-sm">
                  Description
                  <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600 h-28 resize-y" />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="flex flex-col text-sm">
                    Date & Time
                    <input type="datetime-local" value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" required />
                  </label>

                  <label className="flex flex-col text-sm">
                    Location
                    <input value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-1 p-2 rounded bg-black border border-orange-600" required />
                  </label>
                </div>
              </>
            )}

            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-2">
                <input id="keepAdding" type="checkbox" checked={keepOpenAfterSave} onChange={(e) => setKeepOpenAfterSave(e.target.checked)} className="w-4 h-4" />
                <label htmlFor="keepAdding" className="text-sm text-gray-300">Keep modal open after save</label>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-3 py-2 rounded bg-gray-800/60">Cancel</button>
                <button type="submit" disabled={saving} className="px-3 py-2 rounded bg-orange-500 text-black font-semibold">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  function ConfirmDialog() {
    if (!confirmOpen || !toDelete) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmOpen(false)} />
        <motion.div className="relative w-full max-w-md p-6 bg-gray-900 border border-red-600 rounded-lg z-10" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h3 className="text-lg font-bold text-red-400">Confirm Delete</h3>
          <p className="mt-2 text-sm text-gray-300">Are you sure you want to delete this {toDelete.type}? This action cannot be undone.</p>
          <div className="mt-4 flex gap-2 justify-end">
            <button onClick={() => setConfirmOpen(false)} className="px-3 py-2 rounded bg-gray-800">Cancel</button>
            <button onClick={confirmDelete} className="px-3 py-2 rounded bg-red-600">Delete</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-500">Safety Dashboard</h1>
            <p className="text-sm text-gray-400">Manage Reports • Hazards • Local Alerts</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-900 rounded p-1 border border-orange-700">
              <TabButton id="reports" label="Reports" />
              <TabButton id="hazards" label="Hazards" />
              <TabButton id="alerts" label="Local Alerts" />
            </div>

            <div className="flex gap-2">
              <button onClick={() => openCreate(activeTab === 'alerts' ? 'alert' : activeTab === 'hazards' ? 'hazard' : 'report')} className="px-3 py-2 rounded bg-orange-500 text-black font-semibold">New</button>
              <button onClick={fetchAll} className="px-3 py-2 rounded bg-gray-800">Refresh</button>
            </div>
          </div>
        </header>

        <main>
          <ListView />
        </main>

        <footer className="mt-8 text-xs text-gray-500">API Base: <span className="text-orange-400">{apiBase}</span></footer>
      </div>

      <FormModal />
      <ConfirmDialog />
    </div>
  );
}
