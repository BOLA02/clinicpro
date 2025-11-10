"use client";

import React from "react";
import { Calendar, User, Clock } from "lucide-react"; // use lucide-react directly

const recentActivities = [
  {
    id: 1,
    type: "appointment",
    patient: "John Smith",
    action: "New appointment scheduled",
    time: "2 hours ago",
    icon: Calendar,
  },
  {
    id: 2,
    type: "patient",
    patient: "Emma Johnson",
    action: "Patient profile updated",
    time: "4 hours ago",
    icon: User,
  },
  {
    id: 3,
    type: "appointment",
    patient: "Michael Brown",
    action: "Appointment completed",
    time: "6 hours ago",
    icon: Clock,
  },
  {
    id: 4,
    type: "patient",
    patient: "Sarah Davis",
    action: "New patient registered",
    time: "1 day ago",
    icon: User,
  },
];

export function RecentActivitySection() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-text-primary mb-6">Recent Activity</h2>

      <div className="space-y-4">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 hover:bg-surface-hover rounded-lg transition-colors"
            >
              <div className="p-3 bg-blue-100 rounded-lg text-primary flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-medium text-sm">{activity.action}</p>
                <p className="text-text-tertiary text-sm">{activity.patient}</p>
              </div>

              <p className="text-text-tertiary text-sm whitespace-nowrap">{activity.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
