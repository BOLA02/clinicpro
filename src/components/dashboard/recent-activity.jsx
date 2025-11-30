"use client";


import { Calendar, User, Clock } from "lucide-react"; 



export function RecentActivitySection() {
  const latestAppointment = recentActivities.find((a) => a.type === "appointment");

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-text-primary mb-6">Recent Appointment</h2>

      <div className="space-y-4">
        {latestAppointment ? (
          (() => {
            const Icon = latestAppointment.icon;
            return (
              <div
                key={latestAppointment.id}
                className="flex items-center gap-4 p-4 hover:bg-surface-hover rounded-lg transition-colors"
              >
                <div className="p-3 bg-blue-100 rounded-lg text-primary flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium text-sm">{latestAppointment.action}</p>
                  <p className="text-text-tertiary text-sm">{latestAppointment.patient}</p>
                </div>

                <p className="text-text-tertiary text-sm whitespace-nowrap">{latestAppointment.time}</p>
              </div>
            );
          })()
        ) : (
          <p className="text-text-tertiary">No recent appointments</p>
        )}
      </div>
    </div>
  );
}
