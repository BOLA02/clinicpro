"use client";

import { useState, useEffect } from "react";
import { Menu, Search, Bell, Settings, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export function Header({ onMenuClick }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // fetch user when header mounts
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!error && user) {
        setUser(user);
      }
    }

    fetchUser();

    //  Listen to auth changes login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  //  Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-surface border-b border-border h-16 flex items-center justify-between px-6">
      {/* Left Side - Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="text-text-primary hover:bg-blue-600 p-2 rounded-lg transition-colors md:hidden"
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
       

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 text-text-primary hover:bg-surface-hover px-3 py-2 rounded-lg transition-colors"
          >
            {/*  If user has image (e.g. Google) show it, else initials */}
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.charAt(0)
                  : "U"}
              </div>
            )}

            <span className="text-sm font-medium hidden md:inline">
              {user?.user_metadata?.full_name || user?.email || "Guest"}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
              
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-surface-hover transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-red-50 transition-colors last:rounded-b-lg text-left"
              >
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
