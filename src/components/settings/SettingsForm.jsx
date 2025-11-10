"use client";

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export function SettingsForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Dr. Sarah Johnson",
    email: "sarah@clinic.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
  };

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">Full Name</label>
        <Input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          disabled={!isEditing}
          className="disabled:bg-surface-hover"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={!isEditing}
          className="disabled:bg-surface-hover"
        />
      </div>

      {/* Password Section */}
      {isEditing && (
        <div className="pt-4 border-t border-border">
          <h3 className="font-medium text-text-primary mb-4 text-sm">Change Password</h3>

          <div className="space-y-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Current Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">New Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Confirm Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-4 py-2 border border-border text-text-primary rounded-md hover:bg-surface-hover transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <Button
              onClick={handleSave}
              className="flex-1 h-10 bg-primary hover:bg-primary-dark text-white font-medium text-sm"
            >
              Save Changes
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="w-full h-10 bg-primary hover:bg-primary-dark text-white font-medium text-sm"
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}

