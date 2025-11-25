import DayCell from "./DayCell";
import TimeColumn from "./TimeColumn";

export default function CalendarGrid({ weekDates, timeslots, getAppointment  }) {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div
          className="grid gap-px bg-border rounded-lg overflow-hidden"
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          
          <div className="bg-surface-hover p-3 font-semibold text-text-primary text-sm">
            Time
          </div>

      
          {weekDates.map((date, i) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={i}
                className={`p-3 text-center font-semibold text-sm ${
                  isToday ? "bg-primary text-white" : "bg-surface-hover"
                }`}
              >
                <div>{dayNames[i]}</div>
                <div className="text-xs">
                  {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            );
          })}

        
          <TimeColumn timeslots={timeslots} />

         
          {timeslots.map((time) =>
            weekDates.map((date) => {
              const appointment = getAppointment(date, time);
              const now = new Date();
              const slotDateTime = new Date(`${date.toISOString().split("T")[0]}T${time}:00`);
              const isPast = slotDateTime < now;

              return (
                <DayCell
                  key={`${date}-${time}`}
                  appointment={appointment}
                  isPast={isPast}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
