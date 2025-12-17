import { NavLink, Link } from "react-router-dom";
import { usePremium } from "../context/PremiumContext";
import { PieChart } from "lucide-react";

export default function Navbar() {
  const { setShowPaywall } = usePremium();

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "text-text-secondary hover:text-primary";

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <PieChart size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            Portfallo
          </span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm items-center">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/upload" className={linkClass}>
            Upload
          </NavLink>

          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/transactions" className={linkClass}>
            Pricing
          </NavLink>

          <NavLink to="/alerts" className={linkClass}>
            Alerts
          </NavLink>

          <button
            onClick={() => setShowPaywall(true)}
            className="nav-upgrade ml-4"
          >
            Upgrade
          </button>
        </nav>

        <nav className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setShowPaywall(true)}
            className="nav-upgrade"
          >
            Upgrade
          </button>
        </nav>
      </div>
    </header>
  );
}
