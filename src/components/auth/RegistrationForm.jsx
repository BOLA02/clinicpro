import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from "lucide-react";

// Custom Input Component (replaces shadcn Input)
function Input({ className = "", icon: Icon, showPasswordToggle, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-3 w-5 h-5 text-text-tertiary pointer-events-none" />
      )}
      <input
        className={`w-full h-11 pl-10 pr-10 border border-border rounded-md bg-background text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary transition ${className}`}
        {...props}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={showPasswordToggle.onToggle}
          className="absolute right-3 top-3 text-text-tertiary hover:text-text-primary transition"
        >
          {showPasswordToggle.show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}

// Custom Button Component
function Button({ children, disabled, className = "", ...props }) {
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

export function RegistrationForm() {
  const [activeTab, setActiveTab] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface border border-border rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Create Account</h1>
          <p className="text-text-tertiary">Join our clinic management system</p>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-3 mb-8 bg-surface-hover p-1 rounded-lg">
          {["patient", "staff"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setFormData({ ...formData, role: tab });
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              {tab === "patient" ? "Patient" : "Staff"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Full Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              icon={User}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Email Address</label>
            <Input
              type="email"
              placeholder="john@example.com"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={Lock}
              showPasswordToggle={{
                show: showPassword,
                onToggle: () => setShowPassword(!showPassword),
              }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Confirm Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-text-tertiary text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}