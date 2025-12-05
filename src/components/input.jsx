import { Eye, EyeOff} from "lucide-react"
export function Input({ className = "", icon: Icon, showPasswordToggle, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
      )}
      <input
        className={`w-full h-11 pl-10 pr-10 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${className}`}
        {...props}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={showPasswordToggle.onToggle}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 transition"
        >
          {showPasswordToggle.show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
