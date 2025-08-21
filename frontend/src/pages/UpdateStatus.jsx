import { useState } from "react";
import axios from "axios";

const UpdateStatus = () => {
  const [id, setId] = useState("");
  const [status, setStatus] = useState("collected");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/v1/ewaste/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`Status updated: ${res.data.item.status}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Update E-Waste Status</h2>
      {message && <p className="mb-3">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" placeholder="Item ID" value={id} onChange={(e) => setId(e.target.value)} className="w-full border p-2 rounded" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border p-2 rounded">
          {["collected", "in-transit", "recycled", "disposed"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default UpdateStatus;
