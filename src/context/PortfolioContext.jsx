// src/context/PortfolioContext.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo
} from "react";
import Papa from "papaparse";
import { buildPortfolio } from "../portfolio/PortfolioEngine";

const PortfolioContext = createContext();

/* ======================
   PROVIDER
====================== */
export function PortfolioProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCSVUpload = useCallback((file) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data }) => {
        try {
          if (!Array.isArray(data) || data.length === 0) {
            throw new Error("CSV bevat geen geldige data");
          }

          setTransactions(data);

          // 🔒 ENIGE plek waar portfolio wordt gebouwd
          const result = await buildPortfolio(data);
          setPortfolio(result);
        } catch (err) {
          console.error("Portfolio build error:", err);
          setError("Kon portfolio niet verwerken");
          setPortfolio(null);
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        console.error("CSV parse error:", err);
        setError("CSV kon niet worden gelezen");
        setLoading(false);
      }
    });
  }, []);

  /* ======================
     AFGELEIDE WAARDEN
     (engine-consistent)
  ====================== */
  const derived = useMemo(() => {
    if (!portfolio) return {};

    const {
      openPositions = [],
      cashByCurrency = {},
      portfolioValue = 0
    } = portfolio;

    const totalCash = Object.values(cashByCurrency).reduce(
      (sum, v) => sum + Number(v?.balance || v || 0),
      0
    );

    return {
      totalCash,
      totalInvested: portfolioValue,
      assetCount: openPositions.length
    };
  }, [portfolio]);

  return (
    <PortfolioContext.Provider
      value={{
        transactions,
        portfolio,
        loading,
        error,
        handleCSVUpload,
        ...derived
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

/* ======================
   HOOK (MOET BLIJVEN!)
====================== */
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error(
      "usePortfolio must be used inside PortfolioProvider"
    );
  }
  return context;
}
