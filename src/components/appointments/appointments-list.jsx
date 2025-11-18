import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          date,
          time,
          description,
          patient:patient_id (
            id,
            user: user_id (
              full_name,
              email
            )
          )
        `)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
      } else {
        setAppointments(data);
      }

      setLoading(false);
    };

    fetchAppointments();
  }, []);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="space-y-4">
      {appointments.map((appt) => (
        <div
          key={appt.id}
          className="border rounded-md p-4 bg-white shadow-sm"
        >
          <p>
            <strong>Patient:</strong> {appt.patient.user.full_name} (
            {appt.patient.user.email})
          </p>
          <p>
            <strong>Date:</strong> {appt.date} <strong>Time:</strong>{" "}
            {appt.time}
          </p>
          {appt.description && (
            <p>
              <strong>Notes:</strong> {appt.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
