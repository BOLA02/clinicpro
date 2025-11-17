"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { supabase } from "../../lib/supabaseClient";

export function ScheduleAppointmentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    patientEmail: "",
    patientName: "",
    date: "",
    time: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.patientEmail || !formData.date || !formData.time) {
        alert("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }

      // Step 1: Check if user exists
      let { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", formData.patientEmail)
        .single();

      if (userError && userError.code !== "PGRST116") {
        // PGRST116 = no rows found
        throw userError;
      }

      // Step 2: If user does not exist, create new user
      if (!user) {
        const { data: newUser, error: newUserError } = await supabase
          .from("users")
          .insert({
            email: formData.patientEmail,
            full_name: formData.patientName || formData.patientEmail,
            role: "patient",
          })
          .select()
          .single();

        if (newUserError) throw newUserError;

        user = newUser;
      }

      // Step 3: Check if patient record exists
      let { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      // Step 4: If patient does not exist, create it
      if (!patient) {
        const { data: newPatient, error: newPatientError } = await supabase
          .from("patients")
          .insert({
            user_id: user.id,
          })
          .select()
          .single();

        if (newPatientError) throw newPatientError;
        patient = newPatient;
      }

      // Step 5: Create appointment
      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          patient_id: patient.id,
          date: formData.date,
          time: formData.time,
          description: formData.description,
        });

      if (appointmentError) throw appointmentError;

      alert("Appointment scheduled successfully!");
      onClose();
    } catch (err) {
      console.error("Error scheduling appointment:", err.message);
      alert("❌ " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface">
          <h2 className="text-xl font-bold text-text-primary">Schedule Appointment</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Patient Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Patient Email</label>
            <Input
              type="email"
              placeholder="Enter patient email"
              value={formData.patientEmail}
              onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
              required
            />
          </div>

          {/* Patient Name (optional, for new users) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Patient Name (optional)</label>
            <Input
              placeholder="Full name if new patient"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Time</label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Description</label>
            <textarea
              placeholder="Appointment description or notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border text-text-primary rounded-md hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
