"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

import CalendarHeader from "../calender/CalenderHeader";
import CalendarGrid from "../calender/CalendarGrid";
import Legend from "../calender/Legend";

import { TIMESLOTS } from "./../../lib/constants";

export function AppointmentsCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user, role } = useAuth();

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select(`
            *,
            patients (
              user_id,
              users (
                full_name,
                email
              )
            )
          `);
        
        if (error) throw error;

      
        const flattenedData = data.map(appointment => ({
          ...appointment,
         
          patient_name: appointment.patients?.users?.full_name || 'Unknown Patient',
          email: appointment.patients?.users?.email || "unknown email"       }));
       
        setAppointments(flattenedData);

        if (flattenedData.length > 0) {
          console.log(flattenedData[0].patient_name);
        }

      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchAppointments();
  }, [user, role]);

function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = String(parseInt(hours) + 12);
  }

  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours.padStart(2, "0")}:${minutes}:00`;
}

  function getWeekDates(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
      const x = new Date(monday);
      x.setDate(monday.getDate() + i);
      return x;
    });
  }

  const weekDates = getWeekDates(currentDate);


const getAppointment = (date, time) => {
  const dateStr = date.toISOString().split("T")[0];
  const normalized = convertTo24Hour(time);

  return appointments.find(a => a.date === dateStr && a.time === normalized);
};


 
  const previousWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const nextWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const today = () => setCurrentDate(new Date());

  if (loading) return <p>Loading calendar...</p>;

  return (
    <div className="w-full bg-surface rounded-lg border border-border p-6">
      <CalendarHeader
        weekDates={weekDates}
        previousWeek={previousWeek}
        nextWeek={nextWeek}
        today={today}
      /> 

      <CalendarGrid
        weekDates={weekDates}
        timeslots={TIMESLOTS}
        getAppointment={getAppointment}
      /> 

      <Legend />
    </div>
  );
}