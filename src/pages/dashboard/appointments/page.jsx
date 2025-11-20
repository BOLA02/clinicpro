import { useState } from "react";
import { ScheduleAppointmentModal } from "../../../components/appointments/schedule-appointment-modal";
import { AppointmentsCalendar } from "../../../components/appointments/appointments-calendar";

export default function AppointmentsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Appointments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Schedule New
        </button>
      </div>

      {/* Calendar View */}
      <AppointmentsCalendar />

      <ScheduleAppointmentModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}