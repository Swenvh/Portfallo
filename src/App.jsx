import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import PaywallModal from "./components/PaywallModal";
import { seedInitialPrices } from "./services/seedPrices";

import HomePage from "./pages/Homepage";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
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
        <Route path="/upgrade" element={<UpgradePage />} />
        <Route path="/" element={
          <main className="max-w-7xl mx-auto px-6 py-8">
            <HomePage />
          </main>
        } />
        <Route path="/upload" element={
          <main className="max-w-7xl mx-auto px-6 py-8">
            <UploadPage />
          </main>
        } />
        <Route path="/dashboard" element={
          <main className="max-w-7xl mx-auto px-6 py-8">
            <DashboardPage />
          </main>
        } />
        <Route path="/alerts" element={
          <main className="max-w-7xl mx-auto px-6 py-8">
            <AlertsPage />
          </main>
        } />
        <Route path="/transactions" element={
          <main className="max-w-7xl mx-auto px-6 py-8">
            <TransactionsPage />
          </main>
        } />
      </Routes>
    </>
  );
}
