import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import PaywallModal from "./components/PaywallModal";
import AuthProtectedRoute from "./components/AuthProtectedRoute";
import { seedInitialPrices } from "./services/seedPrices";

import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import DemoPage from "./pages/DemoPage";
import AlertsPage from "./pages/AlertsPage";
import TransactionsPage from "./pages/TransactionsPage";
import UpgradePage from "./pages/UpgradePage";

export default function App() {
  useEffect(() => {
    const initPrices = async () => {
      const seeded = localStorage.getItem('prices_seeded');
      if (!seeded) {
        console.log('[App] Seeding initial stock prices...');
        const success = await seedInitialPrices();
        if (success) {
          localStorage.setItem('prices_seeded', 'true');
        }
      }
    };

    initPrices();
  }, []);

  return (
    <>
      <Navbar />
      <PaywallModal />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/upgrade" element={<UpgradePage />} />
        <Route path="/transactions" element={<TransactionsPage />} />

        <Route path="/" element={
          <main className="max-w-7xl mx-auto px-6 py-8">
            <HomePage />
          </main>
        } />

        <Route path="/demo" element={
          <main className="max-w-7xl mx-auto px-6 py-8">
            <DemoPage />
          </main>
        } />

        <Route path="/upload" element={
          <AuthProtectedRoute>
            <main className="max-w-7xl mx-auto px-6 py-8">
              <UploadPage />
            </main>
          </AuthProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <AuthProtectedRoute>
            <main className="max-w-7xl mx-auto px-6 py-8">
              <DashboardPage />
            </main>
          </AuthProtectedRoute>
        } />

        <Route path="/alerts" element={
          <AuthProtectedRoute>
            <main className="max-w-7xl mx-auto px-6 py-8">
              <AlertsPage />
            </main>
          </AuthProtectedRoute>
        } />
      </Routes>
    </>
  );
}
