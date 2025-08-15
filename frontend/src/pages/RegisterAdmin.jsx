import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [tab, setTab] = useState("admin"); // admin or vendor
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [adminForm, setAdminForm] = useState({
    role: "admin",
    name: "",
    email: "",
    password: "",
    whatsapp: "",
    department: "CSE",
  });

  const [vendorForm, setVendorForm] = useState({
    role: "vendor",
    email: "",
    password: "",
    whatsapp: "",
    address: "",
    location: { coordinates: ["", ""] },
    serviceRadiusKm: "",
    capacityKgPerDay: "",
    workingHours: { start: "", end: "" },
  });

  const handleAdminChange = (e) => setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    if (name === "lng" || name === "lat") {
      const coords = [...vendorForm.location.coordinates];
      coords[name === "lng" ? 0 : 1] = value;
      setVendorForm({ ...vendorForm, location: { coordinates: coords } });
    } else if (name === "start" || name === "end") {
      setVendorForm({
        ...vendorForm,
        workingHours: { ...vendorForm.workingHours, [name]: value },
      });
    } else {
      setVendorForm({ ...vendorForm, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = tab === "admin" ? adminForm : vendorForm;
      const res = await axios.post(`/api/v1/auth/register`, payload);
      console.log("Register response:", res.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8 border border-gray-200">
        {/* Tabs */}
        <div className="flex mb-6 rounded-full overflow-hidden border border-gray-200 shadow-sm">
          <button
            onClick={() => setTab("admin")}
            className={`flex-1 py-2 font-medium text-center transition-colors duration-300 ${
              tab === "admin"
                ? "bg-blue-600 text-white shadow-inner"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setTab("vendor")}
            className={`flex-1 py-2 font-medium text-center transition-colors duration-300 ${
              tab === "vendor"
                ? "bg-blue-600 text-white shadow-inner"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
          >
            Vendor
          </button>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "admin" ? (
            <>
              <input type="text" name="name" placeholder="Name" value={adminForm.name} onChange={handleAdminChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <input type="email" name="email" placeholder="Email" value={adminForm.email} onChange={handleAdminChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <input type="password" name="password" placeholder="Password" value={adminForm.password} onChange={handleAdminChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <input type="text" name="whatsapp" placeholder="WhatsApp Number" value={adminForm.whatsapp} onChange={handleAdminChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <select name="department" value={adminForm.department} onChange={handleAdminChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition">
                {["CSE", "IT", "DS", "ECE", "EEE", "ME", "CE", "Other"].map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </>
          ) : (
            <>
              <input type="email" name="email" placeholder="Email" value={vendorForm.email} onChange={handleVendorChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <input type="password" name="password" placeholder="Password" value={vendorForm.password} onChange={handleVendorChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <input type="text" name="whatsapp" placeholder="WhatsApp Number" value={vendorForm.whatsapp} onChange={handleVendorChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <input type="text" name="address" placeholder="Address" value={vendorForm.address} onChange={handleVendorChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <div className="flex gap-2">
                <input type="number" name="lng" placeholder="Longitude" value={vendorForm.location.coordinates[0]} onChange={handleVendorChange} className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
                <input type="number" name="lat" placeholder="Latitude" value={vendorForm.location.coordinates[1]} onChange={handleVendorChange} className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              </div>
              <input type="number" name="serviceRadiusKm" placeholder="Service Radius (km)" value={vendorForm.serviceRadiusKm} onChange={handleVendorChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <input type="number" name="capacityKgPerDay" placeholder="Capacity (kg/day)" value={vendorForm.capacityKgPerDay} onChange={handleVendorChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <div className="flex gap-2">
                <input type="time" name="start" placeholder="Start Time" value={vendorForm.workingHours.start} onChange={handleVendorChange} className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
                <input type="time" name="end" placeholder="End Time" value={vendorForm.workingHours.end} onChange={handleVendorChange} className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              </div>
            </>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 transition font-medium shadow-md">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
