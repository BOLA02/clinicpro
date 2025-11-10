import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            ClinicPro
          </Link>
          <nav className="flex space-x-8">
            <Link to="/login" className="text-text-primary hover:text-primary transition">
              Login
            </Link>
            <Link to="/register" className="text-text-primary hover:text-primary transition">
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}