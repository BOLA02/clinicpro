"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { supabase } from "../../lib/supabaseClient";
import { services as SERVICES_LIST } from "../services";

const TIMESLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];

export function ScheduleAppointmentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    date: "",
    service: "",
    staff_id: "",
    mode: "onsite",
    slot: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        alert("You must be logged in to schedule an appointment.");
        onClose();
      } else {
        setUser(user);
      }
    };

    if (isOpen) fetchUser();
  }, [isOpen, onClose]);

  // Fetch staff who specialize in the selected service
  useEffect(() => {
    const fetchStaff = async () => {
      if (!formData.service) {
        setAvailableStaff([]);
        setFormData(prev => ({ ...prev, staff_id: "" }));
        return;
      }

      try {
        const { data: staffList, error } = await supabase
          .from("staff_specializations")
          .select("staff_id, users(id, full_name, email)")
          .eq("service", formData.service);

        if (error) throw error;

        const uniqueStaff = [];
        const seen = new Set();
        staffList?.forEach(s => {
          if (!seen.has(s.staff_id) && s.users) {
            seen.add(s.staff_id);
            uniqueStaff.push({
              id: s.users.id,
              name: s.users.full_name,
              email: s.users.email,
            });
          }
        });

        setAvailableStaff(uniqueStaff);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setAvailableStaff([]);
      }
    };

    fetchStaff();
  }, [formData.service]);

  // Fetch available timeslots based on selected date and staff
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!formData.date) {
        setAvailableSlots(TIMESLOTS);
        return;
      }

      try {
        const appointmentDate = new Date(formData.date);
        const dayOfWeek = appointmentDate.getDay();

        // Fetch staff availability for this day
        let staffAvailability = null;
        if (formData.staff_id) {
          const { data, error } = await supabase
            .from("staff_availability")
            .select("available_slots")
            .eq("staff_id", formData.staff_id)
            .eq("day_of_week", dayOfWeek)
            .single();

          if (error && error.code !== "PGRST116") throw error;
          staffAvailability = data;
        }

        // Fetch booked appointments for this date and staff (if selected)
        let query = supabase
          .from("appointments")
          .select("time");

        if (formData.staff_id) {
          query = query.eq("staff_id", formData.staff_id);
        }

        const { data: booked, error: bookedErr } = await query
          .eq("date", formData.date);

        if (bookedErr) throw bookedErr;

        const bookedTimes = (booked || []).map((b) => b.time);
        setBookedSlots(bookedTimes);

        // Calculate available slots
        let slots = TIMESLOTS;

        // Filter by staff availability if staff is selected
        if (staffAvailability?.available_slots) {
          slots = slots.filter(s => staffAvailability.available_slots.includes(s));
        }

        // Remove booked slots
        slots = slots.filter(s => !bookedTimes.includes(s));

        setAvailableSlots(slots);
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setAvailableSlots(TIMESLOTS);
      }
    };

    fetchAvailableSlots();
  }, [formData.date, formData.staff_id]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.date || !formData.slot || !formData.service) {
        alert("Please fill in date, service, and select an available timeslot.");
        setIsLoading(false);
        return;
      }

      // Check if appointment is in the past
      const now = new Date();
      const appointmentDateTime = new Date(`${formData.date}T${formData.slot}:00`);
      if (appointmentDateTime < now) {
        alert("Cannot schedule appointment in the past. Please select a future date and time.");
        setIsLoading(false);
        return;
      }

      // Step 1: Check if patient record exists
      let { data: patient, error: patientError } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (patientError && patientError.code !== "PGRST116") {
        throw patientError;
      }

      // Step 2: If patient does not exist, create it
      if (!patient) {
        const { data: newPatient, error: newPatientError } = await supabase
          .from("patients")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (newPatientError) throw newPatientError;
        patient = newPatient;
      }

      // Step 3: Double-check timeslot availability server-side
      const { data: existing, error: existErr } = await supabase
        .from("appointments")
        .select("id")
        .eq("date", formData.date)
        .eq("time", formData.slot)
        .eq("staff_id", formData.staff_id || null)
        .limit(1);

      if (existErr) throw existErr;
      if (existing && existing.length > 0) {
        alert("Selected timeslot is no longer available. Please choose another slot.");
        setIsLoading(false);
        return;
      }

      // Step 4: Create appointment with staff assignment
      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          patient_id: patient.id,
          date: formData.date,
          time: formData.slot,
          description: formData.description,
          service: formData.service,
          mode: formData.mode,
          staff_id: formData.staff_id || null,
        });

      if (appointmentError) throw appointmentError;

      alert("Appointment scheduled successfully!");
      onClose();
    } catch (err) {
      console.error("Error scheduling appointment:", err.message);
      alert(err.message);
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
          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Service */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Service</label>
            <select
              className="w-full h-11 border rounded-md px-3"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              required
            >
              <option value="">Select service</option>
              {SERVICES_LIST.map((s, i) => (
                <option key={i} value={s.title}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* Staff */}
          {formData.service && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Specialist (Optional)</label>
              <select
                className="w-full h-11 border rounded-md px-3"
                value={formData.staff_id}
                onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
              >
                <option value="">Any available specialist</option>
                {availableStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mode */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Mode</label>
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="mode"
                  value="onsite"
                  checked={formData.mode === "onsite"}
                  onChange={() => setFormData({ ...formData, mode: "onsite" })}
                />
                <span>Onsite</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="mode"
                  value="online"
                  checked={formData.mode === "online"}
                  onChange={() => setFormData({ ...formData, mode: "online" })}
                />
                <span>Online</span>
              </label>
            </div>
          </div>

          {/* Timeslot */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Timeslot</label>
            <select
              className="w-full h-11 border rounded-md px-3"
              value={formData.slot}
              onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
              required
            >
              <option value="">Select timeslot</option>
              {TIMESLOTS.map((t) => {
                const now = new Date();
                const isToday = formData.date === new Date().toISOString().split("T")[0];
                const slotTime = new Date(`${formData.date}T${t}:00`);
                const isPastTime = isToday && slotTime < now;
                
                return (
                  <option 
                    key={t} 
                    value={t} 
                    disabled={isPastTime || !availableSlots.includes(t)}
                  >
                    {t} {isPastTime ? " (past)" : bookedSlots.includes(t) ? " (booked)" : availableSlots.includes(t) ? "" : " (unavailable)"}
                  </option>
                );
              })}
            </select>
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
