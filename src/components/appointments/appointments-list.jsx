"use client"



import { Clock, Stethoscope, CheckCircle, AlertCircle, XCircle } from "lucide-react"


const mockAppointments = [
  {
    id: 1,
    patientName: "John Smith",
    doctorName: "Dr. Johnson",
    date: "2025-01-15",
    time: "10:00 AM",
    status: "upcoming",
    description: "Regular Checkup",
  },
  {
    id: 2,
    patientName: "Emma Johnson",
    doctorName: "Dr. Williams",
    date: "2025-01-15",
    time: "11:30 AM",
    status: "upcoming",
    description: "Consultation",
  },
  {
    id: 3,
    patientName: "Michael Brown",
    doctorName: "Dr. Davis",
    date: "2025-01-15",
    time: "02:00 PM",
    status: "upcoming",
    description: "Follow-up Visit",
  },
  {
    id: 4,
    patientName: "Sarah Davis",
    doctorName: "Dr. Johnson",
    date: "2025-01-08",
    time: "03:00 PM",
    status: "completed",
    description: "Regular Checkup",
  },
  {
    id: 5,
    patientName: "David Wilson",
    doctorName: "Dr. Williams",
    date: "2025-01-05",
    time: "09:00 AM",
    status: "cancelled",
    description: "Consultation",
  },
]

function getStatusIcon(status) {
  switch (status) {
    case "upcoming":
      return <Clock className="w-5 h-5 text-warning" />
    case "completed":
      return <CheckCircle className="w-5 h-5 text-success" />
    case "cancelled":
      return <XCircle className="w-5 h-5 text-error" />
    default:
      return <AlertCircle className="w-5 h-5 text-text-tertiary" />
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "upcoming":
      return "bg-yellow-100 text-warning"
    case "completed":
      return "bg-green-100 text-success"
    case "cancelled":
      return "bg-red-100 text-error"
    default:
      return "bg-surface-hover text-text-secondary"
  }
}

export function AppointmentsList() {
  return (
    <div className="space-y-4">
      {mockAppointments.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{appointment.description}</h3>
                  <p className="text-text-secondary text-sm">{appointment.patientName}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}`}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                  <span className="text-text-secondary">
                    {appointment.date} at {appointment.time}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Stethoscope className="w-4 h-4 text-text-tertiary" />
                  <span className="text-text-secondary">{appointment.doctorName}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(appointment.status)}
                  <span className="text-text-secondary capitalize">{appointment.status}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 md:flex-col">
              {appointment.status === "upcoming" && (
                <>
                  <button className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                    Reschedule
                  </button>
                  <button className="flex-1 px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-surface-hover transition-colors text-sm font-medium">
                    Cancel
                  </button>
                </>
              )}
              {appointment.status === "completed" && (
                <button className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-surface-hover transition-colors text-sm font-medium">
                  View Notes
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
