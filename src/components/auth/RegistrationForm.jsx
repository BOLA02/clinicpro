import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Toast } from "../ui/toast";
import { Button } from "../button";
import {Input} from "../input"



export function RegistrationForm() {
  const [activeTab, setActiveTab] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",

    dob: "",
    gender: "",
    address: "",
    phone: "",

    // medical record fields
    includeMedical: false,
    age: "",
    blood_group: "",
    allergies: "",
    chronic_conditions: "",

    position: "",
    department: "",
    license_no: "",
  });

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // STEP 1: Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        showToast("error", error.message);
        return;
      }

      const user = data?.user;

      if (!user) {
        setIsLoading(false);
        showToast("error", "Failed to create user");
        return;
      }

      // STEP 2: Insert into app-level `users` table
      const { error: profileError } = await supabase.from("users").insert({
        id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone || null,

        // patient fields
        dob: formData.dob || null,
        gender: formData.gender || null,
        address: formData.address || null,

        // medical record fields
        include_medical: formData.includeMedical || false,
        age: formData.age || null,
        blood_group: formData.blood_group || null,
        allergies: formData.allergies || null,
        chronic_conditions: formData.chronic_conditions || null,

        // staff fields
        position: formData.position || null,
        department: formData.department || null,
        license_no: formData.license_no || null,

        created_at: new Date().toISOString(),
      });

      if (profileError) {
        setIsLoading(false);
        console.error(profileError);
        showToast("error", "Failed to save user profile");
        return;
      }

      setIsLoading(false);

      showToast("success", "Registration successful! Please check your email to confirm your account.");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      showToast("error", "An unexpected error occurred. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_SITE_URL + "/dashboard",
      },
    });
    setIsLoading(false);
    if (error) {
      showToast("error", error.message);
    }
  };

  return (
    <>
      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={hideToast}
        />
      )}
   <div className="w-full  grid lg:grid-cols-3 gap-8 items-center  p-4">

    {/**left side */}
        <div className="bg-blue-600   p-8 hidden lg:block lg:col-span-2   text-white ">
            
            <h1 className="text-4xl font-bold mb-3">Welcome to ClinicPro</h1>
            <p className="text-lg opacity-90">
              The smart way to manage patients, appointments, and clinical workflow.
            </p>
       
          <div className="ml-auto flex items-center h-full z-10">
            <img src="/doc.png" alt="Medical abstract hero" className="w-full max-w-xl object-contain opacity-95" />
          </div>
        </div>


        
  {/* Right Side - Registration Form */}
  <div className="lg:col-span-1 bg-white rounded-3xl  p-8 lg:p-10">
          <div className=" text-center">
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
                    ? "bg-primary hover:bg-primary-dark text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab === "patient" ? "Patient" : "Staff"}
              </button>
            ))}
          </div>

          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
                  showToast("error", "Please fill in all required fields");
                  return;
                }
                if (formData.password !== formData.confirmPassword) {
                  showToast("error", "Passwords do not match");
                  return;
                }
                setStep(2);
              }}
              className="space-y-5 mt-6"
            >
              <Input
                type="text"
                placeholder="Full Name"
                icon={User}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />

              <Input
                type="email"
                placeholder="Email"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
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
                required
              />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />

              <Button type="submit">
                Continue
              </Button>
            </form>
          )}

          {step === 2 && formData.role === "patient" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="date"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={(e) => {
                  const dob = e.target.value;
                  const age = dob
                    ? Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
                    : "";
                  setFormData({ ...formData, dob, age });
                }}
              />

              <select
                className="w-full h-11 border rounded-md px-3"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <Input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <div className="flex items-center gap-2">
                <input
                  id="includeMedical"
                  type="checkbox"
                  checked={formData.includeMedical}
                  onChange={(e) => setFormData({ ...formData, includeMedical: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="includeMedical" className="text-sm text-gray-700">
                  Include medical record
                </label>
              </div>

              {formData.includeMedical && (
                <>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    readOnly
                  />

                  <select
                    className="w-full h-11 border rounded-md px-3"
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>

                  <Input
                    type="text"
                    placeholder="Allergies (comma separated)"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  />

                  <Input
                    type="text"
                    placeholder="Chronic Conditions"
                    value={formData.chronic_conditions}
                    onChange={(e) => setFormData({ ...formData, chronic_conditions: e.target.value })}
                  />
                </>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  className="bg-gray-300 text-gray-800 hover:bg-gray-400"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Patient Account"}
                </Button>
              </div>
            </form>
          )}

          {step === 2 && formData.role === "staff" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                placeholder="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />

              <Input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />

              <Input
                type="text"
                placeholder="License Number"
                value={formData.license_no}
                onChange={(e) => setFormData({ ...formData, license_no: e.target.value })}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  className="bg-gray-300 text-gray-800 hover:bg-gray-400"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Staff Account"}
                </Button>
              </div>
            </form>
          )}

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
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full h-11 border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-3"
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
    </>
  );
}