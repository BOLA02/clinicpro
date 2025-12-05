import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Calendar } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full z-50">
      {/*  Top Announcement Bar */}
      <div className="bg-[#0ea5e9] text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-2 flex-wrap">
          <Calendar /> 
          <span>The 50% OFF offer is available — Book a Medical Visit</span>
          <Link to="/login" className="underline font-medium">
            Book Now
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/clinic-pro.png"
              alt="Clinic Logo"
              className="h-10 w-auto"
            />
            
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link to="/" className="hover:text-[#0ea5e9] transition">Home</Link>
            <Link to="/" className="hover:text-[#0ea5e9] transition">Medical Services</Link>
            <Link to="/" className="hover:text-[#0ea5e9] transition">Our Doctors</Link>
            <Link to="/" className="hover:text-[#0ea5e9] transition">FAQs</Link>
            <Link to="/" className="hover:text-[#0ea5e9] transition">Photo Gallery</Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex">
            <Link
              to="/login"
              className="bg-[#0ea5e9] text-white px-5 py-2 rounded-lg shadow hover:bg-[#0284c7] transition"
            >
              Get in touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
            <Link to="/" className="block hover:text-[#0ea5e9] transition">Home</Link>
            <Link to="/" className="block hover:text-[#0ea5e9] transition">Medical Services</Link>
            <Link to="/" className="block hover:text-[#0ea5e9] transition">Our Doctors</Link>
            <Link to="/" className="block hover:text-[#0ea5e9] transition">FAQs</Link>
            <Link to="/" className="block hover:text-[#0ea5e9] transition">Photo Gallery</Link>
            <Link
              to="/login"
              className="block bg-[#0ea5e9] text-white px-4 py-2 text-center rounded-lg shadow hover:bg-[#0284c7] transition"
            >
              Get in touch
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
