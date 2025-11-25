import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

export function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);

      try {
        // If current user is a patient, only fetch their appointments
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
              patient:patient_id (
                id,
                user: user_id (
                  full_name,
                  email
                )
              )
            `)
            .eq("patient_id", patient.id)
            .order("date", { ascending: true })
            .order("time", { ascending: true });

          if (error) throw error;
          setAppointments(data || []);
        } else {
          // staff/admin: fetch all appointments
          const { data, error } = await supabase
            .from("appointments")
            .select(`
              id,
              date,
              time,
              service,
              mode,
              description,
              patient:patient_id (
                id,
                user: user_id (
                  full_name,
                  email
                )
              )
            `)
            .order("date", { ascending: true })
            .order("time", { ascending: true });

          if (error) throw error;
          setAppointments(data || []);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, role]);

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
          {appt.service && (
            <p>
              <strong>Service:</strong> {appt.service}
            </p>
          )}
          {appt.mode && (
            <p>
              <strong>Mode:</strong> {appt.mode}
            </p>
          )}
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
