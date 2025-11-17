"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { supabase } from "../../lib/supabaseClient";

export function ScheduleAppointmentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    patientEmail: "",
    doctorName: "",
    date: "",
    time: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientEmail || !formData.date || !formData.time) {
      alert("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Check if patient exists by email
      const { data: existingPatients, error: patientError } = await supabase
        .from("patients")
        .select("id, full_name")
        .eq("email", formData.patientEmail)
        .limit(1);

      if (patientError) throw patientError;

      if (!existingPatients || existingPatients.length === 0) {
        alert("Patient not found. Please add the patient first.");
        setIsLoading(false);
        return;
      }

      const patientId = existingPatients[0].id;

      // Step 2: Create appointment
      const { data, error: appointmentError } = await supabase.from("appointments").insert([
        {
          patient_id: patientId,
          doctor_name: formData.doctorName,
          date: formData.date,
          time: formData.time,
          description: formData.description,
          status: "scheduled",
        },
      ]);

      if (appointmentError) throw appointmentError;

      alert("Appointment scheduled successfully!");
      onClose();
      setFormData({
        patientEmail: "",
        doctorName: "",
        date: "",
        time: "",
        description: "",
      });
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      alert( err.message);
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
          <Input
            placeholder="Patient Email"
            type="email"
            value={formData.patientEmail}
            onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
            required
          />
          <Input
            placeholder="Doctor Name"
            value={formData.doctorName}
            onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
          />
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
          <textarea
            placeholder="Appointment description or notes..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border text-text-primary rounded-md hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-10 bg-primary hover:bg-primary-dark text-white font-medium">
              {isLoading ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
