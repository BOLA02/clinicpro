import { Link } from "react-router-dom";
import { ArrowRightIcon, ClipboardList, MailIcon, PhoneCallIcon } from "lucide-react";
import HeroImage from "../assets/hero-hospital.png";

export function Hero() {
  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            {/* Left Section */}
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Health Is Our Priority
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Experience compassionate healthcare with cutting-edge technology. Book appointments, manage health
                records, and get expert medical care all in one place.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
                <Link
                  to="/login"
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  Schedule Visit
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>

                <Link
                  to="#"
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Section */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
              <img
                src={HeroImage}
                alt="Hospital"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />

              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-indigo-500/30 mix-blend-multiply"></div>

              <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow text-xs sm:text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-gray-900">Open 24/7 Emergency Care</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Box */}
        <div className="w-full sm:w-[90%] md:w-[60%] mx-auto rounded-xl bg-gradient-to-r from-[#fdfeff] to-[#e5f2ff] border-2 border-r-[#2F80ED80] border-t-[#2F80ED50] border-l-[#2F80ED50] border-b-[#2F80ED80] p-4 sm:p-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Easily book an appointment in 3 simple steps.
            </h3>

            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition-all"
            >
              Get in touch
            </Link>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="flex flex-col p-2">
              <div className="flex items-center gap-2">
                <MailIcon className="text-blue-600 h-5" />
                <p className="text-sm text-gray-600">Email Address</p>
              </div>
              <input
                placeholder="Enter Your Email Address"
                className="mt-2 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col p-2">
              <div className="flex items-center gap-2">
                <PhoneCallIcon className="text-blue-600 h-5" />
                <p className="text-sm text-gray-600">Contact Number</p>
              </div>
              <input
                placeholder="Enter Your Contact Number"
                className="mt-2 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col p-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="text-blue-600 h-5" />
                <p className="text-sm text-gray-600">Date of Appointment</p>
              </div>
              <input
                placeholder="Select Date of Appointment"
                className="mt-2 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="p-6 sm:p-12 w-[92%] mx-auto text-center">
        <p className="font-bold text-[#2F80ED] mb-2">At Clinic Pro.</p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl inline-block">
          <span className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            We combine <span className="font-bold">innovative</span>
            <div className="bg-[#D9D9D9] rounded-full w-8 h-8 flex items-center justify-center">
              <img src="/buld.png" alt="bulb icon" className="h-5 w-5" />
            </div>
            <span className="font-bold">technologies</span>
          </span>
          <span className="block mt-2">
            with a human approach to make every patient <strong>feel confident and calm.</strong>
          </span>
        </h2>

        <p className="mt-4 text-sm sm:text-base">
          Our clinic is <strong>a space of trust</strong>, modern medicine and care, based on many years of experience and love for people.
        </p>

        <div className="mt-6">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition-all"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
