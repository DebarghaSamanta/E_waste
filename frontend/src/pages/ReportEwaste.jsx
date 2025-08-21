import { useState } from "react";
import axios from "axios";

const ReportEwaste = () => {
  const [form, setForm] = useState({ itemName: "", category: "Laptop", description: "", weightKg: "" });
  const [qrImage, setQrImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/v1/ewaste", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQrImage(res.data.qrCodeImage);
      setMessage("E-waste item registered successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Register E-Waste Item</h2>
      {message && <p className="mb-3 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="itemName" placeholder="Item Name" value={form.itemName} onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded">
          {["Laptop", "Mobile", "Battery", "Monitor", "Other"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="number" name="weightKg" placeholder="Weight (kg)" value={form.weightKg} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
      </form>

      {qrImage && (
        <div className="mt-6 text-center">
          <p className="mb-2">Scan this QR to track item:</p>
          <img src={qrImage} alt="QR Code" className="mx-auto w-40 h-40" />
        </div>
      )}
    </div>
  );
};

export default ReportEwaste;
