

export default function DayCell({ appointment, isPast }) {
  return (
    <div
      className={`h-16 p-2 border border-border text-xs ${
        appointment ? "bg-primary/10" : "bg-surface"
      }`}
    >
      {appointment && (
        <div className="text-text-primary">
          <strong>{appointment.patient_name}</strong> 
          <p>{appointment.email}</p>  
          <div className="text-[10px]">{appointment.service}</div>
        </div>
      )}
    </div>
      )}
    
