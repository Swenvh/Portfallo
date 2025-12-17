import { NavLink } from "react-router-dom";
import { usePremium } from "../context/PremiumContext";

export default function Navbar() {
  const { setShowPaywall } = usePremium();

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "text-text-secondary hover:text-primary";

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
          Portfallo
        </div>

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
