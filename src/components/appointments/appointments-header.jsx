"use client"

import { Plus, Filter } from "@/components/icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScheduleAppointmentModal } from "./schedule-appointment-modal"

export function AppointmentsHeader() {
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")

  return (
    <>
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex gap-3 flex-1">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button className="px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-2 flex-shrink-0">
              <Filter className="w-5 h-5" />
              <span className="hidden md:inline">Filter</span>
            </button>
          </div>

          <Button
            onClick={() => setShowScheduleModal(true)}
            className="h-11 bg-primary hover:bg-primary-dark text-white font-medium flex items-center gap-2 flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {showScheduleModal && <ScheduleAppointmentModal onClose={() => setShowScheduleModal(false)} />}
    </>
  )
}
