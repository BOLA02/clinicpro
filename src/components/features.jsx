const features = [
  {
    stat: "98%",
    label: "Patient Satisfaction Rate",
  },
  {
    stat: "500+",
    label: "Successful Treatments Monthly",
  },
  {
    stat: "24/7",
    label: "Emergency Support Available",
  },
  {
    stat: "50+",
    label: "Experienced Medical Experts",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary">Why Choose Us</h2>
            <p className="text-xl text-text-tertiary max-w-2xl mx-auto">
              We combine medical excellence with patient-centered care
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="text-center space-y-2 p-6 bg-surface rounded-xl shadow-sm border border-border">
                <h3 className="text-4xl font-bold text-primary">{feature.stat}</h3>
                <p className="text-text-tertiary">{feature.label}</p>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            {/* Advanced Technology */}
            <div className="p-8 bg-surface rounded-xl shadow-sm border border-border space-y-6">
              <h3 className="text-2xl font-semibold text-text-primary">Advanced Technology</h3>
              <ul className="space-y-4">
                {["Latest diagnostic equipment", "Electronic health records", "Telemedicine capabilities"].map(
                  (item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-text-primary">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Patient Care */}
            <div className="p-8 bg-surface rounded-xl shadow-sm border border-border space-y-6">
              <h3 className="text-2xl font-semibold text-text-primary">Patient Care</h3>
              <ul className="space-y-4">
                {["Personalized treatment plans", "Compassionate staff", "Easy appointment scheduling"].map(
                  (item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-text-primary">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Custom Check Icon (replaces Lucide CheckCircle)
function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}