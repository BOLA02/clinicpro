"use client";

import React from "react";
import { SettingsForm } from "../../../components/settings/SettingsForm";
import { ThemeToggle } from "../../../components/settings/ThemeToggle";
import { StaffSettingsForm } from "../../../components/settings/StaffSettingsForm";
import { useAuth } from "../../../context/AuthContext";

export default function SettingsPage() {
  const { role } = useAuth();

  // Staff get special settings page for availability
  if (role === "staff") {
    return <StaffSettingsForm />;
  }

  // Patient settings page
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">Profile Settings</h2>
          <SettingsForm />
        </div>

        {/* Theme Settings */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">Appearance</h2>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}