import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarHeader({ weekDates, previousWeek, nextWeek, today }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">
          {weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <p className="text-text-secondary text-sm">
          {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
          {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={previousWeek} className="p-2 hover:bg-surface-hover rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={today}
          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
        >
          Today
        </button>

        <button onClick={nextWeek} className="p-2 hover:bg-surface-hover rounded">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
