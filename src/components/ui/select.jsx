export function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}