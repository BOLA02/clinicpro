// Custom SVG Icons (replacing Lucide)
const HeartIcon = () => (
  <svg className="w-6 h-6" fill="#35a5e9" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const BrainIcon = () => (
  <svg className="w-6 h-6" fill="#35a5e9" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 1.86.72 3.56 1.9 4.83.33.35.52.81.52 1.3v1.37c0 .55.45 1 1 1h1v2c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2h1c.55 0 1-.45 1-1v-1.37c0-.49.19-.95.52-1.3C18.28 12.56 19 10.86 19 9c0-3.87-3.13-7-7-7zm-3 13H8v-1h1v1zm0-3H8V9h1v3zm4 3h-1v-1h1v1zm0-3h-1V9h1v3z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-6 h-6" fill="#35a5e9" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-6 h-6" fill="#35a5e9" viewBox="0 0 24 24">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

export const services = [
  {
    icon: HeartIcon,
    title: "Cardiology",
    description: "Expert heart care and preventive cardiovascular services for all ages.",
  },
  {
    icon: BrainIcon,
    title: "Neurology",
    description: "Comprehensive neurological treatments and specialized brain care.",
  },
  {
    icon: ActivityIcon,
    title: "General Practice",
    description: "Routine checkups, preventive care, and general health management.",
  },
  {
    icon: EyeIcon,
    title: "Ophthalmology",
    description: "Vision care, eye exams, and advanced eye treatment options.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary">Our Services</h2>
          <p className="text-xl text-text-tertiary max-w-2xl mx-auto">
            Comprehensive medical services delivered by experienced healthcare professionals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={i}
                className="group cursor-pointer p-6 bg-surface rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition mb-4">
                  <Icon className="text-[#35a5e9]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-text-primary">{service.title}</h3>
                <p className="text-sm text-text-tertiary">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
