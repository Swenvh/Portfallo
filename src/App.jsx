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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </main>
    </>
  );
}
