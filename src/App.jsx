// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PaywallModal from "./components/PaywallModal";

import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import AlertsPage from "./pages/AlertsPage";
import TransactionsPage from "./pages/TransactionsPage";

export default function App() {
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
