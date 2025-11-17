export function CTA() {
  return (
    <section className="py-20 sm:py-32 bg-primary text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
          Ready to Take Control of Your Health?
        </h2>

        {/* Subtext */}
        <p className="text-xl opacity-90">
          Join thousands of patients who trust us with their healthcare. Schedule your appointment today.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {/* Primary Button */}
          <button className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl text-lg">
            Book Appointment Now
          </button>

          {/* Outline Button */}
          <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition text-lg backdrop-blur-sm">
            Call: +234 (9068) 603-516
          </button>
        </div>
      </div>
    </section>
  );
}
