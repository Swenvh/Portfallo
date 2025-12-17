import { NavLink } from "react-router-dom";
import { usePremium } from "../context/PremiumContext";

export default function Navbar() {
  const { setShowPaywall } = usePremium();

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-gray-900";

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO / NAAM */}
        <div className="font-bold text-lg">
          Portfallo
        </div>

        {/* NAV */}
        <nav className="flex gap-6 text-sm items-center">
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
            Transacties
          </NavLink>

          <NavLink to="/alerts" className={linkClass}>
            Alerts
          </NavLink>

          {/* CTA */}
          <button
            onClick={() => setShowPaywall(true)}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Upgrade
          </button>
        </nav>
      </div>
    </header>
  );
}
