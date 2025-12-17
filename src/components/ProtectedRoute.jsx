// src/components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePremium } from '../context/PremiumContext';

export default function ProtectedRoute({ children }) {
  const { isPremium, setShowPaywall } = usePremium();
  const location = useLocation();

  useEffect(() => {
    if (!isPremium) {
      setShowPaywall(true);
    }
    // eslint-disable-next-line
  }, [isPremium]);

  if (!isPremium) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
