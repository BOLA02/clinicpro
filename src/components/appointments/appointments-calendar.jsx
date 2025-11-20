"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

const TIMESLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];

export function AppointmentsCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week"); 
  const { user, role } = useAuth();

  // Fetch appointments for the current month
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);

      try {
        
        if (role === "patient" && user) {
          const { data: patient, error: patientErr } = await supabase
            .from("patients")
            .select("id")
            .eq("user_id", user.id)
            .single();

          if (patientErr && patientErr.code !== "PGRST116") {
            throw patientErr;
          }

          if (!patient) {
            setAppointments([]);
            setLoading(false);
            return;
          }

          const { data, error } = await supabase
            .from("appointments")
            .select(`
              id,
              date,
              time,
              service,
              mode,
              description,
              staff_id,
              patient:patient_id (
                id,
                user: user_id (
                  full_name,
                  email
                )
              )
            `)
            .eq("patient_id", patient.id);

          if (error) throw error;
          setAppointments(data || []);
        } else {
         
          const { data, error } = await supabase
            .from("appointments")
            .select(`
              id,
              date,
              time,
              service,
              mode,
              description,
              staff_id,
              patient:patient_id (
                id,
                user: user_id (
                  full_name,
                  email
                )
              )
            `);

          if (error) throw error;

          const staffIds = [...new Set(data?.filter(a => a.staff_id).map(a => a.staff_id))];
          let staffMap = {};

          if (staffIds.length > 0) {
            const { data: staffData, error: staffErr } = await supabase
              .from("users")
              .select("id, full_name, email")
              .in("id", staffIds);

            if (!staffErr && staffData) {
              staffMap = Object.fromEntries(staffData.map(s => [s.id, s]));
            }
          }

      
          const enrichedData = data?.map(appt => ({
            ...appt,
            staff: appt.staff_id ? staffMap[appt.staff_id] : null
          })) || [];

          setAppointments(enrichedData);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, role]);

  
  const getWeekDates = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(d.setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

 
  const  getAppointmentForSlot = (date, time) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.find((apt) => apt.date === dateStr && apt.time === time);
  };


  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  if (loading) return <p>Loading calendar...</p>;

  return (
    <div className="w-full bg-surface rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            {weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <p className="text-text-secondary text-sm">
            {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
            {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
            <button
            onClick={previousWeek}
            className="p-2 hover:bg-surface-hover rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={today}
            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Today
          </button>
          
          <button
            onClick={nextWeek}
            className="p-2 hover:bg-surface-hover rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Day Headers */}
          <div className="grid gap-px bg-border rounded-lg overflow-hidden" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
            <div className="bg-surface-hover p-3 font-semibold text-text-primary text-sm">Time</div>
            {weekDates.map((date, i) => (
              <div
                key={i}
                className={`p-3 text-center font-semibold text-sm ${
                  date.toDateString() === new Date().toDateString()
                    ? "bg-primary text-white"
                    : "bg-surface-hover text-text-primary"
                }`}
              >
                <div>{dayNames[i]}</div>
                <div className="text-xs">{formatDate(date)}</div>
              </div>
            ))}

            
            {TIMESLOTS.map((time) => (
              <div key={`time-${time}`} className="bg-surface-hover p-2 text-xs font-medium text-text-secondary text-center border-r border-border">
                {time}
              </div>
            ))}

            
            {TIMESLOTS.map((time) =>
              weekDates.map((date, dateIdx) => {
                const appointment = getAppointmentForSlot(date, time);
                const now = new Date();
                const slotDateTime = new Date(`${date.toISOString().split("T")[0]}T${time}:00`);
                const isPast = slotDateTime < now;

                return (
                  <div
                    key={`${time}-${dateIdx}`}
                    className={`p-2 min-h-16 border-r border-b border-border text-xs ${
                      isPast ? "bg-gray-50 border border-gray-200 opacity-20" : appointment ? "bg-blue-900 text-white border border-blue-900": "bg-surface hover:bg-surface-hover"
                    }`}

                    title={isPast ? "Past appointment - cannot book" : appointment ? `Booked: ${appointment.patient.user.full_name}` : "Available"}
                  >
                    {isPast && (
                      <div className="text-gray-600 font-semibold text-xs">Unavailable</div>
                    )}

                    {appointment && (
                      <div className="relative group">
                        <div className="font-semibold truncate">{appointment.patient.user.full_name}</div>
                        {appointment.staff && (
                          <div className="text-sm truncate">{appointment.staff.full_name}</div>
                        )}

                        {/* Hover tooltip with full details */}
                        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute z-20 left-2 top-2 -translate-y-full w-64 bg-white text-black p-2 rounded shadow-lg">
                          <div className="font-semibold text-sm truncate">{appointment.patient.user.full_name}</div>
                          <div className="text-xs text-muted-foreground">{appointment.patient.user.email}</div>
                          {appointment.staff && (
                            <div className="mt-1 text-sm">Assigned: {appointment.staff.full_name} ({appointment.staff.email})</div>
                          )}
                          <div className="mt-1 text-sm">Service: {appointment.service}</div>
                          <div className="text-sm">Mode: {appointment.mode}</div>
                          {appointment.description && (
                            <div className="mt-2 text-xs text-gray-700">{appointment.description}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-800 border border-blue-900 rounded"></div>
          <span className="text-text-secondary">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-50 border border-red-200 rounded opacity-60"></div>
          <span className="text-text-secondary">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-surface border border-border rounded"></div>
          <span className="text-text-secondary">Available</span>
        </div>
      </div>
    </div>
  );
}
