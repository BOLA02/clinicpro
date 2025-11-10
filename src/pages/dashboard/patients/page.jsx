"use client"

import { PatientsTable } from "../../../components/patients/PatientsTable"
import { PatientsHeader } from "../../../components/patients/PatientsHeader"

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Patients</h1>
        <p className="text-text-secondary">Manage all patient records and information</p>
      </div>

      <PatientsHeader />
      <PatientsTable />
    </div>
  )
}
