"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

export function PatientsTable() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

const fetchPatients = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    // Check logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    //  Verify Staff Role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "staff") {
      setError("Unauthorized - Only staff can view patients");
      setLoading(false);
      return;
    }

    //  Fetch patients (id, user_id, created_at)
    const { data: patientData, error: patientErr } = await supabase
      .from("patients")
      .select("id, user_id, created_at");

    if (patientErr) throw patientErr;

    if (!patientData || patientData.length === 0) {
      setPatients([]);
      setLoading(false);
      return;
    }

    // Fetch user info for all patients (dob, gender, address stored in users)
    const userIds = patientData.map((p) => p.user_id);
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("id, full_name, email, phone, dob, gender, address, role")
      .in("id", userIds);

    if (userErr) throw userErr;

    // Fetch appointments for all patients
    const patientIds = patientData.map((p) => p.id);
    const { data: appointments, error: apptErr } = await supabase
      .from("appointments")
      .select("patient_id, date");

    if (apptErr) throw apptErr;

    // Build maps for quick lookup
    const userMap = new Map(userData.map((u) => [u.id, u]));
    const appointmentsByPatient = new Map();
    (appointments || []).forEach((apt) => {
      if (!appointmentsByPatient.has(apt.patient_id)) {
        appointmentsByPatient.set(apt.patient_id, []);
      }
      appointmentsByPatient.get(apt.patient_id).push(apt);
    });

    //  Transform + compute only last appointment
    const transformed = patientData.map((p) => {
      const userInfo = userMap.get(p.user_id) || {};
      // Skip entries where the linked user is a staff account
      if (userInfo.role === "staff") return null;
      const patientAppts = appointmentsByPatient.get(p.id) || [];
      const latestVisit = patientAppts.length
        ? patientAppts.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
        : null;

      return {
        id: p.id,
        full_name: userInfo.full_name,
        gender: userInfo.gender,
        age: calculateAge(userInfo.dob),
        contact: userInfo.phone || userInfo.email || "-",
        last_visit: latestVisit,
      };
    });

    // Remove nulls (staff links) and sort by last_visit DESC (null last)
    const filtered = transformed.filter(Boolean);

    filtered.sort((a, b) => {
      if (!a.last_visit) return 1;
      if (!b.last_visit) return -1;
      return new Date(b.last_visit) - new Date(a.last_visit);
    });

    setPatients(filtered);

  } catch (err) {
    setError(err.message);
  }

  setLoading(false);
}, []);


  // Fetch + Real-time listeners
  useEffect(() => {
    fetchPatients();

    const channel = supabase
      .channel("patients-changes")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "patients" },
        () => fetchPatients()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchPatients]);

  if (loading) return <p className="p-4 text-center">Loading patients...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <table className="w-full hidden md:table">
        <thead className="bg-surface-hover border-b">
          <tr>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Gender</th>
            <th className="px-6 py-4 text-left">Age</th>
            <th className="px-6 py-4 text-left">Contact</th>
            <th className="px-6 py-4 text-left">Last Visit</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-surface-hover">
              <td className="px-6 py-4">{patient.full_name}</td>
              <td className="px-6 py-4">{patient.gender}</td>
              <td className="px-6 py-4">{patient.age}</td>
              <td className="px-6 py-4">{patient.contact}</td>
              <td className="px-6 py-4">{patient.last_visit}</td>
              <td className="px-6 py-4 text-right">
                <MoreVertical className="w-4 h-4 cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
