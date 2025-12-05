export function Button({ children, disabled, className = "", ...props }) {
  return (
    <button
      disabled={disabled}
      className={`w-full h-11 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
