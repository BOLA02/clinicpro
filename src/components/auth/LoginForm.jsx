"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { supabase } from "../../lib/supabaseClient";
import { Toast } from "../ui/toast";

export function LoginForm() {
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const showToast = (type, message) => setToast({ type, message });
  const hideToast = () => setToast(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setIsLoading(false);
        return showToast("error", authError.message);
      }

      const user = authData.user;

      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        setIsLoading(false);
        showToast("error", "Your account is not fully registered yet. Please create an account.");
        await supabase.auth.signOut();
        setTimeout(() => window.location.href = "/register", 2000);
        return;
      }

      showToast("success", "Login successful! Redirecting...");
      setTimeout(() => window.location.href = "/dashboard", 1500);
    } catch {
      setIsLoading(false);
      showToast("error", "An error occurred while signing in");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: import.meta.env.VITE_SITE_URL + "/dashboard" },
    });
    setIsLoading(false);
    if (error) showToast("error", error.message);
  };

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}

      <div className="min-h-screen flex flex-col lg:flex-row bg-blue-600">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/3 flex justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <img
              src="/clinic-pro.png"
              alt="ClinicPro Logo"
              className="h-12 mb-6 mx-auto"
            />
            <p className="text-center text-gray-600 mb-6">Log in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember Me */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer mb-2 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? "Signing in..." : <>
                  Sign in to Dashboard <ArrowRight className="w-4 h-4" />
                </>}
              </Button>
            </form>

            {/* Sign up */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Request Access
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or continue with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google Sign-In */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full h-11 border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-3"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </Button>
          </div>
        </div>

        {/* Right side - Branding/Image */}
        <div className="hidden lg:flex lg:w-2/3 relative bg-blue-600 overflow-hidden">
          <div className="absolute top-10 left-10 z-20 max-w-md text-white">
            <h1 className="text-4xl font-bold mb-3">Welcome to ClinicPro</h1>
            <p className="text-lg opacity-90">
              The smart way to manage patients, appointments, and clinical workflow.
            </p>
          </div>

          <div className="ml-auto flex items-center h-full z-10">
            <img src="/doc.png" alt="Medical abstract hero" className="w-full max-w-xl object-contain opacity-95" />
          </div>
        </div>
      </div>
    </>
  );
}
