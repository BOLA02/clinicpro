import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AgenticChat } from "./components/agentic-chat";
import LandingPage from "./pages/landing/page";
import DashboardLayout from "./pages/dashboard/layout";
import DashboardPage from "./pages/dashboard/page";
import AppointmentsPage from "./pages/dashboard/appointments/page";
import PatientsPage from "./pages/dashboard/patients/page";
import SettingsPage from "./pages/dashboard/settings/page";
import LoginPage from "./pages/login/page";
import RegisterPage from "./pages/register/page";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import './App.css'


function ProtectedRoute({ element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return user ? element : <Navigate to="/login" replace />;
}

function RoleBasedRoute({ element, allowedRole }) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
}

function AppRoutes() {
  return (
    <Routes>
    
      <Route path="/" element={
        <>
      <AgenticChat />
      <LandingPage />
    </>
  } />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

    
      <Route
        path="/dashboard/*"
        element={<ProtectedRoute element={ <>
      <AgenticChat />
      <DashboardLayout />
    </>} />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="patients" element={<RoleBasedRoute element={<PatientsPage />} allowedRole="staff" />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") {
        document.documentElement.classList.add("dark");
        return;
      }
      if (stored === "light") {
        document.documentElement.classList.remove("dark");
        return;
      }

      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) document.documentElement.classList.add("dark");
    } catch (e) {
      
    }
  }, []);
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
