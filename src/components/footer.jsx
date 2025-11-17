import { Link } from "react-router-dom";
import {Heart} from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-text-primary">HealthCare</span>
            </div>
            <p className="text-sm text-text-tertiary">
              Providing compassionate healthcare to our community since 2015.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Services</h4>
            <ul className="space-y-2 text-sm text-text-tertiary">
              {["Cardiology", "Neurology", "General Care"].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="hover:text-text-primary transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Company</h4>
            <ul className="space-y-2 text-sm text-text-tertiary">
              {["About Us", "Contact", "Careers"].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="hover:text-text-primary transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Legal</h4>
            <ul className="space-y-2 text-sm text-text-tertiary">
              {["Privacy Policy", "Terms of Service", "HIPAA Notice"].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="hover:text-text-primary transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-tertiary">
            © 2025 HealthCare Clinic. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "Facebook"].map((social) => (
              <Link
                key={social}
                to="#"
                className="text-sm text-text-tertiary hover:text-text-primary transition"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}