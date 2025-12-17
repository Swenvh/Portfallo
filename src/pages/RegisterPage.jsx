import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is verplicht";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ongeldig email adres";
    }

    if (!password) {
      newErrors.password = "Wachtwoord is verplicht";
    } else if (password.length < 6) {
      newErrors.password = "Wachtwoord moet minimaal 6 tekens zijn";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Bevestig je wachtwoord";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Wachtwoorden komen niet overeen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const result = await register(email, password, confirmPassword);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Account aanmaken</h1>
          <p className="auth-subtitle">Start gratis met het tracken van je portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email adres
            </label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                placeholder="jouw@email.nl"
                disabled={loading}
              />
            </div>
            {errors.email && <p className="auth-field-error">{errors.email}</p>}
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Wachtwoord
            </label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            {errors.password && <p className="auth-field-error">{errors.password}</p>}
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword" className="auth-label">
              Bevestig wachtwoord
            </label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`auth-input ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            {errors.confirmPassword && <p className="auth-field-error">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="auth-spinner" />
                Account aanmaken...
              </>
            ) : (
              'Account aanmaken'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Al een account?{' '}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
