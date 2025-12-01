"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { supabase } from "../../lib/supabaseClient";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Sign in
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

    if (authError) {
      setIsLoading(false);
      alert(authError.message);
      return;
    }

    const user = authData.user;

    //  Check if user exists in "users" table
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    //  Reject login if user table record missing
    if (!existingUser) {
      setIsLoading(false);

      alert(
        "Your account is not fully registered yet.\n\nPlease create an account."
      );

      // Log them out immediately
      await supabase.auth.signOut();

      window.location.href = "/register";
      return;
    }

    //  Redirect (valid user)
    setIsLoading(false);
    window.location.href = "/dashboard";
  } catch (err) {
    setIsLoading(false);
    alert(err.message || "An error occurred while signing in");
  }
};


  return (
    <div className="w-full max-w-md">
      <div className="bg-surface border border-border rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to your clinic account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-text-tertiary pointer-events-none" />
              <Input
                type="email"
                placeholder="doctor@clinic.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10 h-11"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-text-tertiary pointer-events-none" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-10 pr-10 h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-text-tertiary hover:text-text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="w-4 h-4 rounded border border-border accent-primary"
              />
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-medium group flex items-center justify-center"
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4 ml-2 translate-y-[1px] transition-all duration-200 ease-in-out group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-text-secondary text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Create one
          </Link>
        </p>

        {/* OAuth Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="px-3 text-sm text-text-tertiary">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Google Sign In Button */}
        <Button
  type="button"
  onClick={async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_SITE_URL + "/dashboard",

      },
    });
    setIsLoading(false);
    if (error) alert(error.message);
  }}
  className="w-full h-11 bg-primary hover:bg-primary-dark border border-gray-300 text-gray-900 hover:bg-gray-100 
             flex items-center justify-center gap-2"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
    className="w-5 h-5"
  />
  <span className="text-sm font-medium">Sign in with Google</span>
</Button>

      </div>
    </div>
  );
}
