import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import Register from "./pages/RegisterAdmin";
import Login from "./pages/Login";
import ReportEwaste from "./pages/ReportEwaste";
import QrScanner from "./pages/ScanQr";
import UpdateStatus from "./pages/UpdateStatus";
import Dashboard from './pages/Dashboard'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report-ewaste" element={<ReportEwaste />} />
        <Route path="/scan-qr" element={<QrScanner />} />
        <Route path="/update-status" element={<UpdateStatus />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
