import DayCell from "./DayCell";
import TimeColumn from "./TimeColumn";
import React from "react";
export default function CalendarGrid({ weekDates, timeslots, getAppointment  }) {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper function to convert 12-hour time to 24-hour format
  function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours) + 12);
    }

    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div
          className="grid gap-px bg-border rounded-lg overflow-hidden"
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          
          {/* Header row - Time label */}
          <div className="bg-surface-hover p-3 font-semibold text-text-primary text-sm">
            Time
          </div>

          {/* Header row - Day names and dates */}
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

          {/* Body rows - Each timeslot creates a full row */}
          {timeslots.map((time) => (
            <React.Fragment key={`row-${time}`}>
              {/* Time label cell */}
              <div key={`time-${time}`} className="bg-surface-hover p-3 text-sm text-text-secondary flex items-center justify-center">
                {time}
              </div>

              {/* Day cells for this timeslot */}
              {weekDates.map((date) => {
                const appointment = getAppointment(date, time);
                const now = new Date();
                
                // Convert time to 24-hour format for proper date construction
                const time24 = convertTo24Hour(time);
                const slotDateTime = new Date(`${date.toISOString().split("T")[0]}T${time24}:00`);
                const isPast = slotDateTime < now;

                return (
                  <DayCell
                    key={`${date}-${time}`}
                    appointment={appointment}
                    isPast={isPast}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}