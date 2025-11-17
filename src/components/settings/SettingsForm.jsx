"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export function SettingsForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🔹 Load user info from Supabase
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) console.error(error);
      if (user) {
        setUser(user);
        setFormData({
          fullName: user.user_metadata.full_name || "",
          email: user.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    }
    loadUser();
  }, []);

  // 🔹 Save profile changes
  const handleSave = async () => {
    try {
      // Update name and email
      const { error: updateError } = await supabase.auth.updateUser({
        email: formData.email,
        data: { full_name: formData.fullName },
      });

      if (updateError) throw updateError;

      // Update password (if provided)
      if (formData.newPassword && formData.newPassword === formData.confirmPassword) {
        const { error: passError } = await supabase.auth.updateUser({
          password: formData.newPassword,
        });
        if (passError) throw passError;
      }

      alert("✅ Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert("❌ " + err.message);
    }
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
              <label className="block text-sm font-medium text-text-primary">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
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
              <label className="block text-sm font-medium text-text-primary">
                Confirm Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
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
export default SettingsForm;