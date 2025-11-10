"use client"

import { SummaryCard } from "../../components/dashboard/summary-card"
import { RecentActivitySection } from "../../components/dashboard/recent-activity"
import { Users, Calendar, Stethoscope } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome back, Dr. Sarah</p>
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
