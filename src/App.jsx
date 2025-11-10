import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landing/page";
import DashboardLayout from "./pages/dashboard/layout";
import DashboardPage from "./pages/dashboard/page";
import AppointmentsPage from "./pages/dashboard/appointments/page";
import PatientsPage from "./pages/dashboard/patients/page";
import SettingsPage from "./pages/dashboard/settings/page";
import LoginPage from "./pages/login/page";
import RegisterPage from "./pages/register/page";
import './App.css'

function App() {
 const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Landing page is the entry point */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Public auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 3. Protected dashboard */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
