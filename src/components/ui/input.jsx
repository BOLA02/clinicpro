export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary transition ${className}`}
      {...props}
    />
  );
}