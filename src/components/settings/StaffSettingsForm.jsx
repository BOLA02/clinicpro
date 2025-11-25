"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { services } from "../services";
import { Plus, Trash2, Save } from "lucide-react";

const DAYS_OF_WEEK = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 0, name: "Sunday" },
];

const TIMESLOTS = [ 
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];

export function StaffSettingsForm() {
  const { user, role } = useAuth();
  const [specializations, setSpecializations] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch current staff settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user || role !== "staff") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch specializations
        const { data: specs, error: specsErr } = await supabase
          .from("staff_specializations")
          .select("service")
          .eq("staff_id", user.id);

        if (specsErr) throw specsErr;
        setSpecializations(specs?.map(s => s.service) || []);

        // Fetch availability
        const { data: avail, error: availErr } = await supabase
          .from("staff_availability")
          .select("*")
          .eq("staff_id", user.id);

        if (availErr) throw availErr;

        const availMap = {};
        (avail || []).forEach(a => {
          availMap[a.day_of_week] = {
            id: a.id,
            start_time: a.start_time,
            end_time: a.end_time,
            break_start: a.break_start,
            break_end: a.break_end,
            available_slots: a.available_slots || [],
          };
        });
        setAvailability(availMap);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setMessage("Error loading settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user, role]);

  // Add specialization
  const addSpecialization = (service) => {
    if (!specializations.includes(service)) {
      setSpecializations([...specializations, service]);
    }
  };

  // Remove specialization
  const removeSpecialization = (service) => {
    setSpecializations(specializations.filter(s => s !== service));
  };

  // Update availability for a day
  const updateDayAvailability = (dayId, field, value) => {
    setAvailability({
      ...availability,
      [dayId]: {
        ...availability[dayId],
        [field]: value,
      },
    });
  };

  // Toggle timeslot for a day
  const toggleTimeslot = (dayId, slot) => {
    const current = availability[dayId]?.available_slots || [];
    const updated = current.includes(slot)
      ? current.filter(s => s !== slot)
      : [...current, slot].sort();
    updateDayAvailability(dayId, "available_slots", updated);
  };

  // Remove day availability
  const removeDayAvailability = (dayId) => {
    const newAvail = { ...availability };
    delete newAvail[dayId];
    setAvailability(newAvail);
  };

  // Save all settings
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Delete old specializations
      await supabase
        .from("staff_specializations")
        .delete()
        .eq("staff_id", user.id);

      // Insert new specializations
      if (specializations.length > 0) {
        const { error: specsErr } = await supabase
          .from("staff_specializations")
          .insert(
            specializations.map(service => ({
              staff_id: user.id,
              service,
            }))
          );
        if (specsErr) throw specsErr;
      }

      // Delete old availability
      await supabase
        .from("staff_availability")
        .delete()
        .eq("staff_id", user.id);

      // Insert new availability
      const availToInsert = Object.entries(availability).map(([dayId, data]) => ({
        staff_id: user.id,
        day_of_week: parseInt(dayId),
        start_time: data.start_time,
        end_time: data.end_time,
        break_start: data.break_start || null,
        break_end: data.break_end || null,
        available_slots: data.available_slots,
      }));

      if (availToInsert.length > 0) {
        const { error: availErr } = await supabase
          .from("staff_availability")
          .insert(availToInsert);
        if (availErr) throw availErr;
      }

      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (role !== "staff") {
    return <p className="text-red-600">Only staff can access this page.</p>;
  }

  if (loading) {
    return <p className="text-center">Loading settings...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Staff Settings</h1>
        <p className="text-text-secondary">Manage your specializations and availability</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      {/* Specializations Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Specializations</h2>
        <p className="text-text-secondary mb-4">Select the services you specialize in:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {services.map((service) => (
            <label key={service.title} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={specializations.includes(service.title)}
                onChange={(e) => {
                  if (e.target.checked) {
                    addSpecialization(service.title);
                  } else {
                    removeSpecialization(service.title);
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-text-primary font-medium">{service.title}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {specializations.map((spec) => (
            <div key={spec} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
              <span>{spec}</span>
              <button
                onClick={() => removeSpecialization(spec)}
                className="text-blue-800 hover:text-blue-900"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Working Hours & Availability</h2>
        <p className="text-text-secondary mb-4">Set your working hours and available timeslots for each day:</p>

        <div className="space-y-6">
          {DAYS_OF_WEEK.map((day) => {
            const dayData = availability[day.id] || {};
            const isSet = !!availability[day.id];

            return (
              <div key={day.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-text-primary">{day.name}</h3>
                  {isSet && (
                    <button
                      onClick={() => removeDayAvailability(day.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>

                {!isSet ? (
                  <button
                    onClick={() =>
                      updateDayAvailability(day.id, "start_time", "09:00")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add this day
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Working hours */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <input
                          type="time"
                          value={dayData.start_time || "09:00"}
                          onChange={(e) => updateDayAvailability(day.id, "start_time", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <input
                          type="time"
                          value={dayData.end_time || "17:00"}
                          onChange={(e) => updateDayAvailability(day.id, "end_time", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>

                    {/* Break time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Break Start (optional)</label>
                        <input
                          type="time"
                          value={dayData.break_start || ""}
                          onChange={(e) => updateDayAvailability(day.id, "break_start", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="HH:MM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Break End (optional)</label>
                        <input
                          type="time"
                          value={dayData.break_end || ""}
                          onChange={(e) => updateDayAvailability(day.id, "break_end", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="HH:MM"
                        />
                      </div>
                    </div>

                    {/* Available timeslots */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Available Timeslots</label>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {TIMESLOTS.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => toggleTimeslot(day.id, slot)}
                            className={`px-3 py-2 rounded text-sm font-medium transition ${
                              dayData.available_slots?.includes(slot)
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 max-w-xs px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
