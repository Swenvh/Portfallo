import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welkom terug</h1>
          <p className="auth-subtitle">Log in op je Portfallo account</p>
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

          <div className="auth-forgot">
            <Link to="/forgot-password" className="auth-link">
              Wachtwoord vergeten?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="auth-spinner" />
                Inloggen...
              </>
            ) : (
              'Inloggen'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Nog geen account?{' '}
            <Link to="/register" className="auth-link">
              Registreer nu
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
