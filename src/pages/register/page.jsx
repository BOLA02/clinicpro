import { RegistrationForm}  from "../../components/auth/RegistrationForm"
import  {MedicalHeader } from "../../components/auth/MedicalHeader"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50 flex flex-col items-center justify-center p-4">
      <MedicalHeader />
      <RegistrationForm />
    </div>
  )
}
