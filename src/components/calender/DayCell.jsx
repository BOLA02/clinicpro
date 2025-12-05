export default function DayCell({ appointment, isPast }) {
  return (
    <div
      className={`h-16 p-2 border border-border text-xs ${
        appointment ? "bg-primary/50" : "bg-surface"
      } ${isPast ? "opacity-50" : ""}`}
    >
      {appointment && (
        <div className="text-text-primary">
          <strong>{appointment.patient_name}</strong> 
          <p className="text-[10px] text-text-secondary">{appointment.email}</p>  
          <div className="text-[10px] text-text-secondary">{appointment.service}</div>
        </div>
      )}
    </div>
  );
}