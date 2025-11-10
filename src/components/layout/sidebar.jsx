"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
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

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/patients", icon: Users, label: "Patients" },
  { href: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ open, onToggle }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } hidden md:flex transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {open && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-text-primary text-lg">PCMA</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent-foreground hover:bg-opacity-10 p-2 rounded-lg transition-colors"
        >
          {open ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent-foreground hover:bg-opacity-10"
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
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent-foreground hover:bg-opacity-10 rounded-lg transition-colors group">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {open && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
