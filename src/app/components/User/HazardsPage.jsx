"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HazardsPage() {
  const API =
    "https://ieee-hazard-analyzer-latest.onrender.com/mongo/hazard-detection";
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    status: "",
    emergencyServicesRequired: [],
    trafficCondition: "",
    dangerLevel: "",
    detectedHazards: [],
    location: "",
    additionalNotes: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await axios.get(API);
    setData(res.data);
  }

  function handleEdit(item) {
    setForm(item);
    setEditId(item._id);
    setModalOpen(true);
  }

  function handleCreate() {
    setForm({
      status: "",
      emergencyServicesRequired: [],
      trafficCondition: "",
      dangerLevel: "",
      detectedHazards: [],
      location: "",
      additionalNotes: "",
    });
    setEditId(null);
    setModalOpen(true);
  }

  async function handleSave() {
    if (editId) {
      await axios.put(`${API}/${editId}`, form);
    } else {
      await axios.post(API, form);
    }
    setModalOpen(false);
    fetchData();
  }

  async function handleDelete(id) {
    await axios.delete(`${API}/${id}`);
    fetchData();
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-orange-500 mb-4">
        Hazard Detections
      </h1>
      <button
        onClick={handleCreate}
        className="bg-orange-500 px-4 py-2 rounded"
      >
        New Hazard
      </button>

      <ul className="mt-4 space-y-2">
        {data.map((h) => (
          <li
            key={h._id}
            className="p-4 bg-gray-900 border border-orange-600 rounded flex justify-between"
          >
            <div>
              <div>Status: {h.status}</div>
              <div>Danger: {h.dangerLevel}</div>
              <div>Location: {h.location}</div>
              <div>{h.additionalNotes}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(h)}
                className="bg-blue-500 px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(h._id)}
                className="bg-red-500 px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 text-white p-6 rounded border border-orange-600">
            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit" : "New"} Hazard
            </h2>
            <input
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              placeholder="Status"
              className="text-black w-full p-2 mb-2"
            />
            <input
              value={form.dangerLevel}
              onChange={(e) =>
                setForm({ ...form, dangerLevel: e.target.value })
              }
              placeholder="Danger Level"
              className="text-black w-full p-2 mb-2"
            />
            <textarea
              value={form.additionalNotes}
              onChange={(e) =>
                setForm({ ...form, additionalNotes: e.target.value })
              }
              placeholder="Notes"
              className="text-black w-full p-2 mb-2"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)}>Cancel</button>
              <button
                onClick={handleSave}
                className="bg-orange-500 px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
