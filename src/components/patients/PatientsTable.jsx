"use client";

import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

export function PatientsTable() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setPatients(data || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPatients();

    // Real-time subscription
    const channel = supabase
      .channel("patients")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patients" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            // Only add if it's not already in the list (avoids duplicates)
            setPatients((prev) => {
              if (prev.some((p) => p.id === payload.new.id)) return prev;
              return [payload.new, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            setPatients((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new : p))
            );
          } else if (payload.eventType === "DELETE") {
            setPatients((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchPatients]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) alert("Error deleting patient: " + error.message);
  };

  if (loading) return <p className="p-4 text-center text-text-secondary">Loading patients...</p>;
  if (error) return <p className="p-4 text-center text-error">Error: {error}</p>;
  if (patients.length === 0) return <p className="p-4 text-center text-text-secondary">No patients found.</p>;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-hover border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Gender</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Age</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Contact</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Last Visit</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{patient.full_name}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{patient.gender}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{patient.age}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{patient.contact}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{patient.last_visit}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                    onClick={() => handleDelete(patient.id)}
                  >
                    <Trash2 className="w-4 h-4 text-error" />
                  </button>
                  <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-text-tertiary" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="md:hidden">
        {patients.map((patient) => (
          <div key={patient.id} className="border-b border-border p-4">
            <button
              onClick={() => setExpandedRow(expandedRow === patient.id ? null : patient.id)}
              aria-expanded={expandedRow === patient.id}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{patient.full_name}</p>
                  <p className="text-sm text-text-secondary">{patient.contact}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary">{patient.age} yrs</p>
                  <p className="text-xs text-text-tertiary">{patient.gender}</p>
                </div>
              </div>
            </button>

            {expandedRow === patient.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Email:</span>
                  <span className="text-sm text-text-primary">{patient.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Last Visit:</span>
                  <span className="text-sm text-text-primary">{patient.last_visit}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
