import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is verplicht";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ongeldig email adres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) return;

    const result = await resetPassword(email);
    if (result.success) {
      setSuccess(true);
      setEmail("");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Wachtwoord vergeten</h1>
          <p className="auth-subtitle">
            Voer je email adres in en we sturen je instructies om je wachtwoord te resetten
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-success">
              <CheckCircle size={18} />
              <span>Controleer je email voor reset instructies</span>
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

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="auth-spinner" />
                Versturen...
              </>
            ) : (
              'Reset link versturen'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="auth-back-link">
            <ArrowLeft size={16} />
            Terug naar inloggen
          </Link>
        </div>
      </div>
    </div>
  );
}
