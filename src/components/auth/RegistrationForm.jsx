import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

function Input({ className = "", icon: Icon, showPasswordToggle, ...props }) {
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

function Button({ children, disabled, className = "", ...props }) {
  return (
    <button
      disabled={disabled}
      className={`w-full h-11 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${className}`}
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // STEP 1: Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: formData.role, // stored as user_metadata
        },
      },
    });

    if (error) {
      setIsLoading(false);
      alert(error.message);
      return;
    }

    const user = data?.user;

    if (!user) {
      setIsLoading(false);
      alert("Failed to create user");
      return;
    }

    // STEP 2: Insert into app-level `users` table
    const { error: profileError } = await supabase.from("users").insert({
      id: user.id,
      full_name: formData.fullName,
      role: formData.role,
    });

    if (profileError) {
      setIsLoading(false);
      console.error(profileError);
      alert("Failed to save user profile");
      return;
    }

    // STEP 3: Insert into role-specific table
    if (formData.role === "patient") {
      await supabase.from("patients").insert({ id: user.id });
    } else if (formData.role === "staff") {
      await supabase.from("staff").insert({ id: user.id });
    }

    setIsLoading(false);

    alert("Registration successful! Please check your email to confirm your account.");
    window.location.href = "/login";
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Join our clinic management system</p>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-3 mb-8 bg-gray-100 p-1 rounded-lg">
          {["patient", "staff"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setFormData({ ...formData, role: tab });
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab === "patient" ? "Patient" : "Staff"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            placeholder="Full Name"
            icon={User}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />

          <Input
            type="email"
            placeholder="Email"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            icon={Lock}
            showPasswordToggle={{
              show: showPassword,
              onToggle: () => setShowPassword(!showPassword),
            }}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
            {!isLoading && (
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
        </form>

        {/* Sign in link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition">
            Sign in
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Login */}
        <Button
          type="button"
          onClick={async () => {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: "http://localhost:5173/dashboard",
              },
            });
            setIsLoading(false);
            if (error) alert(error.message);
          }}
          className="bg-white border border-gray-300 text-gray-900 hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
