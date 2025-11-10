export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    secondary: "bg-surface hover:bg-surface-hover text-text-primary border border-border",
    ghost: "text-text-primary hover:bg-surface-hover",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}