"use client";

import { useState, useEffect } from "react";
import { SummaryCard } from "../../components/dashboard/summary-card";
import { RecentActivitySection } from "../../components/dashboard/recent-activity";
import { Users, Calendar, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { PatientsTable } from "../../components/patients/PatientsTable";
import { AppointmentsList } from "../../components/appointments/appointments-list";


function LatestAppointmentPanel() {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchLatest() {
      setLoading(true);
      try {
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
              user: user_id ( full_name, email )
            )
          `)
          .order("date", { ascending: false })
          .order("time", { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data && mounted) {
          // fetch staff details if present
          if (data.staff_id) {
            const { data: staffData } = await supabase
              .from("users")
              .select("id, full_name, email")
              .eq("id", data.staff_id)
              .single();
            data.staff = staffData || null;
          }
          setLatest(data);
        }
      } catch (err) {
        console.error("Error fetching latest appointment:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLatest();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p className="text-text-secondary">Loading latest appointment...</p>;
  if (!latest) return <p className="text-text-secondary">No appointments found.</p>;

  const aptDateTime = new Date(`${latest.date}T${latest.time}`);
  const isUpcoming = aptDateTime > new Date();

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {isUpcoming ? (
            <Clock className="w-5 h-5 text-blue-600" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
          <h3 className="font-semibold text-text-primary">Appointment</h3>
        </div>
        <p className="text-sm text-text-secondary mb-2">{latest.description || "No description"}</p>
        <div className="flex gap-4 text-sm text-text-secondary">
          <span>📅 {aptDateTime.toLocaleDateString()}</span>
          <span>⏰ {aptDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className="mt-3 text-sm text-text-secondary">
          <strong>Patient:</strong> {latest.patient?.user?.full_name || "-"} ({latest.patient?.user?.email || "-"})
        </div>
        {latest.staff && (
          <div className="text-sm text-text-secondary"> <strong>Staff:</strong> {latest.staff.full_name} ({latest.staff.email})</div>
        )}
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isUpcoming ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
        }`}
      >
        {isUpcoming ? "Upcoming" : "Past"}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [userAppointments, setUserAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [totalPatients, setTotalPatients] = useState(null);
  const { role } = useAuth();

  // Fetch authenticated user
  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) setUser(user);
    }

    fetchUser();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch patient's appointments
  useEffect(() => {
    async function fetchAppointments() {
      if (!user?.id || role !== "patient") return;

      setLoadingAppointments(true);

      // Get patient record
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (patientError) {
        console.error("Error fetching patient:", patientError);
        setLoadingAppointments(false);
        return;
      }

      if (!patientData) {
        setUserAppointments([]);
        setLoadingAppointments(false);
        return;
      }

      // Fetch appointments for this patient
      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", patientData.id)
        .order("date", { ascending: false })
        .limit(5);

      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
      } else {
        setUserAppointments(appointments || []);
      }

      setLoadingAppointments(false);
    }

    fetchAppointments();
  }, [user?.id, role]);

  // Fetch staff summary stats (patients count)
  useEffect(() => {
    const fetchStaffStats = async () => {
      if (role !== "staff") return;

      try {
        // total patients
        const { count: patientCount } = await supabase
          .from("patients")
          .select("id", { count: "exact", head: true });

        setTotalPatients(patientCount ?? 0);
      } catch (err) {
        console.error("Error fetching staff stats:", err);
      }
    };

    fetchStaffStats();
  }, [role]);

  // ---------------- PATIENT DASHBOARD ----------------
  if (role === "patient") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">My Dashboard</h1>
          <p className="text-text-secondary">Welcome back, {user?.user_metadata?.full_name}</p>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Full Name</p>
              <p className="text-lg font-semibold text-text-primary">{user?.user_metadata?.full_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Email</p>
              <p className="text-lg font-semibold text-text-primary">{user?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Appointments Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard
            title="Total Appointments"
            value={userAppointments.length}
            description="Your scheduled appointments"
            icon={<Calendar className="w-6 h-6" />}
            trend="View all in appointments page"
            trendUp={true}
          />
          <SummaryCard
            title="Upcoming"
            value={userAppointments.filter(a => {
              const dateTime = new Date(`${a.date}T${a.time}`);
              return dateTime > new Date();
            }).length}
            description="Coming appointments"
            icon={<Clock className="w-6 h-6" />}
            trend="Check details below"
            trendUp={true}
          />
        </div>

        {/* Recent Appointments */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Your Recent Appointments</h2>

          {loadingAppointments ? (
            <p className="text-text-secondary">Loading appointments...</p>
          ) : userAppointments.length === 0 ? (
            <p className="text-text-secondary">
              No appointments yet.{" "}
              <a href="/dashboard/appointments" className="text-blue-600 hover:underline">Schedule one now</a>
            </p>
          ) : (
            <div className="space-y-3">
              {userAppointments.map((apt) => {
                const aptDateTime = new Date(`${apt.date}T${apt.time}`);
                const isUpcoming = aptDateTime > new Date();

                return (
                  <div key={apt.id} className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isUpcoming ? (
                          <Clock className="w-5 h-5 text-blue-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        <h3 className="font-semibold text-text-primary">Appointment</h3>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{apt.description || "No description"}</p>
                      <div className="flex gap-4 text-sm text-text-secondary">
                        <span>📅 {aptDateTime.toLocaleDateString()}</span>
                        <span>⏰ {aptDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isUpcoming ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isUpcoming ? "Upcoming" : "Past"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------- STAFF DASHBOARD ----------------
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome back, {user?.user_metadata?.full_name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <SummaryCard
          title="Total Patients"
          value={totalPatients ?? "..."}
          description="Active patients in system"
          icon={<Users className="w-6 h-6" />}
          trend="+12% from last month"
          trendUp={true}
        />
      </div>

      {/* Staff panels: Patients and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Patients</h2>
          <PatientsTable />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Latest Appointment</h2>
            <a href="/dashboard/appointments" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>

          <LatestAppointmentPanel />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivitySection />
    </div>
  );
}
