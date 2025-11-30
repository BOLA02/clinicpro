"use client";

import { X, Calendar, Clock, User, FileText, Monitor, Building2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Input } from "../ui/input";
import { supabase } from "../../lib/supabaseClient";
import { services as SERVICES_LIST } from "../services";
import { Toast } from "../ui/toast";

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
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        showToast("error", "You must be logged in to schedule an appointment.");
        onClose();
      } else {
        setUser(user);
      }
    };

    if (isOpen) fetchUser();
  }, [isOpen, onClose]);

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

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!formData.date) {
        setAvailableSlots(TIMESLOTS);
        return;
      }

      try {
        const appointmentDate = new Date(formData.date);
        const dayOfWeek = appointmentDate.getDay();

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

        let slots = TIMESLOTS;

        if (staffAvailability?.available_slots) {
          slots = slots.filter(s => staffAvailability.available_slots.includes(s));
        }

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
        showToast("error", "Please fill in date, service, and select an available timeslot.");
        setIsLoading(false);
        return;
      }

      const now = new Date();
      const appointmentDateTime = new Date(`${formData.date}T${formData.slot}:00`);
      if (appointmentDateTime < now) {
        showToast("error", "Cannot schedule appointment in the past. Please select a future date and time.");
        setIsLoading(false);
        return;
      }

      let { data: patient, error: patientError } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (patientError && patientError.code !== "PGRST116") {
        throw patientError;
      }

      if (!patient) {
        const { data: newPatient, error: newPatientError } = await supabase
          .from("patients")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (newPatientError) throw newPatientError;
        patient = newPatient;
      }

      const { data: existing, error: existErr } = await supabase
        .from("appointments")
        .select("id")
        .eq("date", formData.date)
        .eq("time", formData.slot)
        .eq("staff_id", formData.staff_id || null)
        .limit(1);

      if (existErr) throw existErr;
      if (existing && existing.length > 0) {
        showToast("error", "Selected timeslot is no longer available. Please choose another slot.");
        setIsLoading(false);
        return;
      }

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

      showToast("success", "Appointment scheduled successfully!");
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error scheduling appointment:", err.message);
      showToast("error", err.message || "Failed to schedule appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={hideToast}
        />
      )}

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Schedule Appointment</h2>
                <p className="text-blue-100 text-sm mt-1">Book your consultation with our specialists</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Appointment Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full h-12 pl-4 pr-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Timeslot */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Time Slot
                </label>
                <select
                  className="w-full h-12 pl-4 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white dark:bg-gray-800 appearance-none cursor-pointer"
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                  required
                >
                  <option value="">Select time</option>
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
                        {t} {isPastTime ? "(past)" : bookedSlots.includes(t) ? "(booked)" : availableSlots.includes(t) ? "✓" : "(unavailable)"}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Service */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4 text-blue-600" />
                Service Type
              </label>
              <select
                className="w-full h-12 pl-4 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white dark:bg-gray-800 appearance-none cursor-pointer"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                required
              >
                <option value="">Select a service</option>
                {SERVICES_LIST.map((s, i) => (
                  <option key={i} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>

            {/* Staff - only show if service selected */}
            {formData.service && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 text-blue-600" />
                  Choose Specialist <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <select
                  className="w-full h-12 pl-4 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white dark:bg-gray-800 appearance-none cursor-pointer"
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

            {/* Mode - Enhanced radio buttons */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Monitor className="w-4 h-4 text-blue-600" />
                Consultation Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.mode === "onsite" 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}>
                  <input
                    type="radio"
                    name="mode"
                    value="onsite"
                    checked={formData.mode === "onsite"}
                    onChange={() => setFormData({ ...formData, mode: "onsite" })}
                    className="sr-only"
                  />
                  <Building2 className={`w-5 h-5 ${formData.mode === "onsite" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className={`font-medium ${formData.mode === "onsite" ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                    On-site
                  </span>
                  {formData.mode === "onsite" && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </label>

                <label className={`relative flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.mode === "online" 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}>
                  <input
                    type="radio"
                    name="mode"
                    value="online"
                    checked={formData.mode === "online"}
                    onChange={() => setFormData({ ...formData, mode: "online" })}
                    className="sr-only"
                  />
                  <Monitor className={`w-5 h-5 ${formData.mode === "online" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className={`font-medium ${formData.mode === "online" ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                    Online
                  </span>
                  {formData.mode === "online" && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4 text-blue-600" />
                Additional Notes <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <textarea
                placeholder="Tell us about your symptoms or reason for visit..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                rows="3"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Scheduling...
                  </span>
                ) : "Confirm Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}