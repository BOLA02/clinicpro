"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { supabase } from "../../lib/supabaseClient";

export function AddPatientModal({ onClose, onPatientAdded }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    gender: "",
   phone_number: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure essential fields for both tables are present
    if (!formData.fullName || !formData.email || !formData.phone_number || !formData.dob || !formData.gender) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // 1️⃣ Insert into the 'users' table first
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert()
        .select(); // Returns the newly created user record

      if (userError) throw userError;

      const newUserId = userData[0].id;

      // 2️⃣ Insert into the 'patients' table, linking the records using the same ID
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .insert([
          {
            id: newUserId, // ⚡ Use the ID generated from the users table insertion
            dob: formData.dob,
            gender: formData.gender,
            address: formData.address,
          },
        ])
        .select(); // Returns the newly created patient record

      if (patientError) throw patientError;

      // Immediately add the new patient to the table UI
      if (onPatientAdded && patientData[0]) {
        // Note: The structure passed to onPatientAdded may need adjustment depending on how PatientsTable expects data.
        onPatientAdded(patientData[0]); 
      }

      alert("✅ Patient added successfully!");
      onClose();
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface">
          <h2 className="text-xl font-bold text-text-primary">Add New Patient</h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <Input
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData,phone_number: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Patient"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddPatientModal;