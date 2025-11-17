import {Link} from "react-router-dom";
import HeroImage from "../assets/hero-hospital.png";
export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text & CTA */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
              Your Health Is Our Priority
            </h1>
            <p className="text-xl text-text-tertiary leading-relaxed">
              Experience compassionate healthcare with cutting-edge technology. Book appointments, manage your health
              records, and get expert medical care all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login" className="group flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all shadow-md hover:shadow-lg">
                Schedule Visit
                <ArrowRightIcon />
              </Link>
              <Link to="#" className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-all">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative h-96 rounded-2xl overflow-hidden flex items-center justify-center">
  {/* Background Image */}
  <img
    src={HeroImage}
    alt="Hospital exterior"
    className="absolute inset-0 w-full h-full object-cover opacity-80"
  />

  {/* Overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-indigo-500/30 mix-blend-multiply"></div>

  {/* Badge */}
  <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/30 shadow-sm">
    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
    <span className="text-sm font-medium text-text-primary">Open 24/7 Emergency Care</span>
  </div>
</div>

        </div>
      </div>
    </section>
  );
}

// Custom Arrow Icon (replaces Lucide)
function ArrowRightIcon() {
  return (
    <svg
      className="w-5 h-5 transition-transform group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}