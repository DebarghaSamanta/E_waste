import { useState } from "react";
import Report from "./ReportEwaste";
import ScanQr from "./ScanQr";
import UpdateEwaste from "./UpdateStatus";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("report");
  const renderContent = () => {
    switch (activeTab) {
      case "report":
        return <Report />;
      case "scan":
        return <ScanQr />;
      case "update":
        return <UpdateEwaste />;
      default:
        return <Report />;
    }
  };

  const steps = [
    { id: "report", label: "Report" },
    { id: "scan", label: "Scan QR" },
    { id: "update", label: "Update" },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setActiveTab(step.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === step.id
                  ? "bg-green-500 text-white shadow"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {step.label}
            </button>
            {index < steps.length - 1 && (
              <div className="w-12 h-1 bg-gray-300 mx-2">
                <div
                  className={`h-1 transition-all ${
                    steps.findIndex((s) => s.id === activeTab) > index
                      ? "bg-green-500 w-full"
                      : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Page Content */}
      <div className="p-6 bg-white rounded-xl shadow-md">{renderContent()}</div>
    </div>
  );
}
