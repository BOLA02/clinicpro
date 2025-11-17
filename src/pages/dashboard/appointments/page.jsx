import { useState } from "react";
import { ScheduleAppointmentModal } from "../../../components/appointments/schedule-appointment-modal";

export default function AppointmentsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Appointments</h1>
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
      >
        Schedule New
      </button>

      {/* Your list here */}
      <div className="bg-surface p-4 rounded-lg">No appointments yet.</div>

      <ScheduleAppointmentModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}