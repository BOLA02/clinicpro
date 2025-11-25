export default function AppointmentTooltip({ appointment }) {
  const { patient, staff, service, mode, description } = appointment;

  return (
    <div className="pointer-events-none opacity-0 group-hover:opacity-100 absolute z-20 left-2 top-2 -translate-y-full w-64 bg-white text-black p-2 rounded shadow-lg transition-opacity">
      <div className="font-semibold text-sm truncate">{patient.user.full_name}</div>
      <div className="text-xs text-muted-foreground">{patient.user.email}</div>

      {staff && (
        <div className="mt-1 text-sm">
          Assigned: {staff.full_name} ({staff.email})
        </div>
      )}

      <div className="mt-1 text-sm">Service: {service}</div>
      <div className="text-sm">Mode: {mode}</div>

      {description && (
        <div className="mt-2 text-xs text-gray-700">{description}</div>
      )}
    </div>
  );
}
