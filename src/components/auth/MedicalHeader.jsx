
const HeartIcon = () => (
  <svg
    className="w-6 h-6"
    fill="#35a5e9"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

export function MedicalHeader() {
  return (
    <div className="mb-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-primary rounded-lg">
          <HeartIcon className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-primary">PCMA</h1>
      </div>
      <p className="text-text-tertiary">
        Patient & Clinic Management Application
      </p>
    </div>
  );
}