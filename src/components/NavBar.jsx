import { NavLink, Link } from "react-router-dom";
import { usePremium } from "../context/PremiumContext";
import { useAuth } from "../context/AuthContext";
import { PieChart, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { setShowPaywall } = usePremium();
  const { user, signOut } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "text-text-secondary hover:text-primary";

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

          <NavLink to="/demo" className={linkClass}>
            Demo
          </NavLink>

          {user && (
            <>
              <NavLink to="/upload" className={linkClass}>
                Upload
              </NavLink>

              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/alerts" className={linkClass}>
                Alerts
              </NavLink>
            </>
          )}

          <NavLink to="/transactions" className={linkClass}>
            Pricing
          </NavLink>

          {user ? (
            <>
              <button
                onClick={() => setShowPaywall(true)}
                className="nav-upgrade ml-4"
              >
                Upgrade
              </button>

              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <User size={16} />
                  <span>{user.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-sm transition-colors"
                  title="Uitloggen"
                >
                  <LogOut size={16} />
                  <span>Uitloggen</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Inloggen
            </Link>
          )}
        </nav>

        <nav className="md:hidden flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => setShowPaywall(true)}
                className="nav-upgrade"
              >
                Upgrade
              </button>
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900"
                title="Uitloggen"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Inloggen
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
