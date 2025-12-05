"use client";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/patients", icon: Users, label: "Patients", allowedRoles: ["staff"] },
  { href: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ open, onToggle }) {
  const { role, setUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Listen for Supabase auth changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, [setUser]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);        
    navigate("/login");   
  };

  const visibleItems = menuItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(role);
  });

  return (
    <aside
      className={`${open ? "w-64" : "w-20"} hidden md:flex transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {open && (
          <div className="flex items-center gap-2">
            
            <img src="/clinic-pro.png" alt="" />
            
            
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-blue-600 hover:bg-opacity-10 p-2 rounded-lg transition-colors"
        >
          {open ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#0ea5e9] text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-[#0ea5e9] hover:bg-opacity-10"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {open && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-[#0ea5e9] hover:bg-opacity-10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {open && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
