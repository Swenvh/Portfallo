import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email && password.length >= 6) {
      setUser({ email, name: email.split('@')[0] });
      setLoading(false);
      navigate('/dashboard');
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Ongeldige inloggegevens' };
    }
  };

  const register = async (email, password, confirmPassword) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password !== confirmPassword) {
      setLoading(false);
      return { success: false, error: 'Wachtwoorden komen niet overeen' };
    }

    if (email && password.length >= 6) {
      setUser({ email, name: email.split('@')[0] });
      setLoading(false);
      navigate('/dashboard');
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Vul alle velden correct in' };
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email) {
      setLoading(false);
      return { success: true, message: 'Controleer je email voor reset instructies' };
    } else {
      setLoading(false);
      return { success: false, error: 'Vul een geldig email adres in' };
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
