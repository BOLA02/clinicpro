"use client";

import React, { useState } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

const mockPatients = [
  {
    id: 1,
    name: "John Smith",
    gender: "Male",
    age: 45,
    contact: "(555) 123-4567",
    email: "john@example.com",
    lastVisit: "2025-01-08",
  },
  {
    id: 2,
    name: "Emma Johnson",
    gender: "Female",
    age: 32,
    contact: "(555) 234-5678",
    email: "emma@example.com",
    lastVisit: "2025-01-05",
  },
  {
    id: 3,
    name: "Michael Brown",
    gender: "Male",
    age: 58,
    contact: "(555) 345-6789",
    email: "michael@example.com",
    lastVisit: "2024-12-28",
  },
  {
    id: 4,
    name: "Sarah Davis",
    gender: "Female",
    age: 27,
    contact: "(555) 456-7890",
    email: "sarah@example.com",
    lastVisit: "2024-12-25",
  },
  {
    id: 5,
    name: "David Wilson",
    gender: "Male",
    age: 51,
    contact: "(555) 567-8901",
    email: "david@example.com",
    lastVisit: "2024-12-20",
  },
];

export function PatientsTable() {
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Desktop View */}
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
            {mockPatients.map((patient) => (
              <tr key={patient.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{patient.name}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{patient.gender}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{patient.age}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{patient.contact}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{patient.lastVisit}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-text-tertiary" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {mockPatients.map((patient) => (
          <div key={patient.id} className="border-b border-border p-4">
            <button
              onClick={() => setExpandedRow(expandedRow === patient.id ? null : patient.id)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{patient.name}</p>
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
                  <span className="text-sm text-text-primary">{patient.lastVisit}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-3 py-2 text-sm border border-border rounded-lg hover:bg-surface-hover transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="px-3 py-2 text-sm border border-error text-error rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
