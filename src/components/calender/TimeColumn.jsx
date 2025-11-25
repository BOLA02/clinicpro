export default function TimeColumn({ timeslots }) {
  return (
    <>
      {timeslots.map((time) => (
        <div
          key={time}
          className="bg-surface-hover p-2 text-xs font-medium text-text-secondary text-center border-r border-border"
        >
          {time}
        </div>
      ))}
    </>
  );
}
