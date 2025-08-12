"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LocalAlertsPage() {
  const API = "https://ieee-hazard-analyzer-latest.onrender.com/local-alerts";
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    message: "",
    description: "",
    date: "",
    location: "",
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
    setForm({ ...item, date: item.date?.slice(0, 10) });
    setEditId(item._id);
    setModalOpen(true);
  }

  function handleCreate() {
    setForm({ message: "", description: "", date: "", location: "" });
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
      <h1 className="text-xl font-bold text-orange-500 mb-4">Local Alerts</h1>
      <button
        onClick={handleCreate}
        className="bg-orange-500 px-4 py-2 rounded"
      >
        New Alert
      </button>

      <ul className="mt-4 space-y-2">
        {data.map((a) => (
          <li
            key={a._id}
            className="p-4 bg-gray-900 border border-orange-600 rounded flex justify-between"
          >
            <div>
              <div>{a.message}</div>
              <div>{a.description}</div>
              <div>{new Date(a.date).toLocaleString()}</div>
              <div>Location: {a.location}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(a)}
                className="bg-blue-500 px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(a._id)}
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
              {editId ? "Edit" : "New"} Alert
            </h2>
            <input
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Message"
              className="text-black w-full p-2 mb-2"
            />
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
              className="text-black w-full p-2 mb-2"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="text-black w-full p-2 mb-2"
            />
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Location"
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
