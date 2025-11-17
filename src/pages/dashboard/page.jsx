"use client"
import {useState, useEffect} from "react"
import { SummaryCard } from "../../components/dashboard/summary-card"
import { RecentActivitySection } from "../../components/dashboard/recent-activity"
import { Users, Calendar, Stethoscope, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {supabase} from "../../lib/supabaseClient";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [userAppointments, setUserAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const { role } = useAuth();

  useEffect(() => {    
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!error && user) {
        setUser(user);
      }
    }

    fetchUser();

    //  Listen to auth changes login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch patient's appointments
  useEffect(() => {
    async function fetchAppointments() {
      if (role === "patient" && user?.id) {
        setLoadingAppointments(true);
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("patient_id", user.id)
          .order("appointment_date", { ascending: false })
          .limit(5);

        if (!error && data) {
          setUserAppointments(data);
        }
        setLoadingAppointments(false);
      }
    }

    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id, role]);

  // PATIENT DASHBOARDWould you like me to:


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
            value={userAppointments.filter(a => new Date(a.appointment_date) > new Date()).length}
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
            <p className="text-text-secondary">No appointments yet. <a href="/dashboard/appointments" className="text-blue-600 hover:underline">Schedule one now</a></p>
          ) : (
            <div className="space-y-3">
              {userAppointments.map((apt) => {
                const aptDate = new Date(apt.appointment_date);
                const isUpcoming = aptDate > new Date();
                
                return (
                  <div key={apt.id} className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isUpcoming ? (
                          <Clock className="w-5 h-5 text-blue-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        <h3 className="font-semibold text-text-primary">{apt.title || "Appointment"}</h3>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{apt.description || "No description"}</p>
                      <div className="flex gap-4 text-sm text-text-secondary">
                        <span>📅 {aptDate.toLocaleDateString()}</span>
                        <span>⏰ {aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isUpcoming ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}>
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

  // STAFF DASHBOARD (original)
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome back, {user?.user_metadata?.full_name
          }</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Patients"
          value="248"
          description="Active patients in system"
          icon={<Users className="w-6 h-6" />}
          trend="+12% from last month"
          trendUp={true}
        />
        <SummaryCard
          title="Appointments Today"
          value="14"
          description="Scheduled for today"
          icon={<Calendar className="w-6 h-6" />}
          trend="2 pending confirmation"
          trendUp={false}
        />
        <SummaryCard
          title="Doctors on Duty"
          value="8"
          description="Available now"
          icon={<Stethoscope className="w-6 h-6" />}
          trend="All stations staffed"
          trendUp={true}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivitySection />
    </div>
  )
}
