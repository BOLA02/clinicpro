import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landing/page";
import DashboardLayout from "./pages/dashboard/layout";
import DashboardPage from "./pages/dashboard/page";
import AppointmentsPage from "./pages/dashboard/appointments/page";
import PatientsPage from "./pages/dashboard/patients/page";
import SettingsPage from "./pages/dashboard/settings/page";
import LoginPage from "./pages/login/page";
import RegisterPage from "./pages/register/page";
import { AuthProvider, useAuth } from "./context/AuthContext";
import './App.css'

// Protected route component that checks authentication
function ProtectedRoute({ element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return user ? element : <Navigate to="/login" replace />;
}

// Role-based route component
function RoleBasedRoute({ element, allowedRole }) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role doesn't match, redirect to dashboard
  if (role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
}

function AppRoutes() {
  return (
    <Routes>
      {/* 1. Landing page is the entry point */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Public auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 3. Protected dashboard */}
      <Route
        path="/dashboard/*"
        element={<ProtectedRoute element={<DashboardLayout />} />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="patients" element={<RoleBasedRoute element={<PatientsPage />} allowedRole="staff" />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
