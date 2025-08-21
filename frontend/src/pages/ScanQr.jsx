import React, { useState } from "react";
import { useZxing } from "react-zxing";
import axios from "axios";

export default function QrScanner() {
  const [result, setResult] = useState("");
  const [itemData, setItemData] = useState(null);
  const [error, setError] = useState("");
  const [paused, setPaused] = useState(false); // 👈 new state

  const { ref } = useZxing({
    paused, // 👈 stops camera when true
    onDecodeResult(decodedResult) {
      const qrValue = decodedResult.getText();
      setResult(qrValue);
      setPaused(true); 
      fetchEwasteDetails(qrValue);
      if (onScanned) onScanned(qrValue);
    },
  });

  const fetchEwasteDetails = async (qr) => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Using token:", token);
      console.log("🔍 Fetching details for QR:", qr);

      const res = await axios.get(
        `/api/v1/ewaste/qr/${qr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ API Response:", res.data);
      setItemData(res.data);
      setError("");
    } catch (err) {
      console.error("❌ API Error:", err);
      setItemData(null);
      setError(err.response?.data?.message || "Error fetching details");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">QR Code Scanner</h2>

      {/* Camera Preview */}
      {!paused && <video ref={ref} className="w-80 h-80 border rounded shadow" />}

      {/* Scanned Result */}
      {result && (
        <p className="mt-4 text-blue-600 font-semibold">
          ✅ Scanned QR: {result}
        </p>
      )}

      {/* Item Details */}
      {itemData && (
        <div className="mt-6 p-4 border rounded bg-gray-50 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-2">E-Waste Item Details</h3>
          <pre className="text-sm bg-white p-2 rounded border">
            {JSON.stringify(itemData, null, 2)}
          </pre>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-500 font-semibold">❌ {error}</p>
      )}

      {/* Button to restart scanner */}
      {paused && (
        <button
          onClick={() => {
            setPaused(false);
            setResult("");
            setItemData(null);
            setError("");
          }}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          🔄 Scan Again
        </button>
      )}
    </div>
  );
}
