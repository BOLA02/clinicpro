"use client";

import React, { useState } from "react";
import { Menu, Search, Bell, Settings, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

export function Header({ onMenuClick }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-surface border-b border-border h-16 flex items-center justify-between px-6">
      {/* Left Side - Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="text-text-primary hover:bg-surface-hover p-2 rounded-lg transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-surface-hover px-3 py-2 rounded-lg flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search patients, appointments..."
            className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-tertiary flex-1"
          />
        </div>
      </div>

      {/* Right Side - Icons & Profile */}
      <div className="flex items-center gap-4">
        <button className="text-text-primary hover:bg-surface-hover p-2 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 text-text-primary hover:bg-surface-hover px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="text-sm font-medium hidden md:inline">Dr. Sarah</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-surface-hover transition-colors first:rounded-t-lg"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </Link>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-surface-hover transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-red-50 transition-colors last:rounded-b-lg text-left">
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
