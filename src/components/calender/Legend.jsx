export default function Legend() {
  return (
    <div className="mt-6 flex gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary/10 border border-blue-900 rounded"></div>
        <span className="text-text-secondary">Booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-red-50 border border-red-200 rounded opacity-60"></div>
        <span className="text-text-secondary">Unavailable</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-surface border border-border rounded"></div>
        <span className="text-text-secondary">Available</span>
      </div>
    </div>
  );
}
