import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export function Toast({ type = "success", message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  };

  const textColors = {
    success: "text-green-900",
    error: "text-red-900",
    warning: "text-yellow-900",
    info: "text-blue-900",
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md ${bgColors[type]}`}
      >
        {icons[type]}
        <p className={`flex-1 text-sm font-medium ${textColors[type]}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`hover:opacity-70 transition-opacity ${textColors[type]}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}