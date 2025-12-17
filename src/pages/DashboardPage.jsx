import { useState } from "react";
import PageContainer from "../components/PageContainer";
import PortfolioAllocationChart from "../components/PortfolioAllocationChart";
import PortfolioPerformanceChart from "../components/PortfolioPerformanceChart";
import ClosedPositionsTable from "../components/ClosedPositionsTable";
import StockLogo from "../components/StockLogo";
import { usePortfolio } from "../context/PortfolioContext";
import { Wallet, TrendingUp, Banknote, PieChart, ChevronDown, ChevronUp } from "lucide-react";

function formatMoney(value, currency = "EUR") {
  const symbol = currency === "USD" ? "$" : "€";
  return `${symbol} ${Number(value || 0).toFixed(2)}`;
}

export default function DashboardPage() {
  const { portfolio, loading, transactions } = usePortfolio();
  const [showClosedPositions, setShowClosedPositions] = useState(false);

  if (!portfolio && !loading) {
    return (
      <PageContainer>
        <div className="empty-dashboard">
          <div className="empty-icon">
            <PieChart size={64} />
          </div>
          <h2>Je dashboard is leeg</h2>
          <p className="muted">Upload een CSV bestand om je portfolio te analyseren</p>
        </div>
      </PageContainer>
    );
  }

  const {
    openPositions = [],
    closedPositions = [],
    cashByCurrency = {},
    portfolioValue = 0,
    unrealizedPL = 0,
    realizedPL = 0,
    totalPL = 0
  } = portfolio || {};

  const safeNumber = (val) => {
    const num = Number(val || 0);
    return isNaN(num) ? 0 : num;
  };

  const eurCash = safeNumber(cashByCurrency?.EUR?.balance || cashByCurrency?.EUR);
  const usdCash = safeNumber(cashByCurrency?.USD?.balance || cashByCurrency?.USD);
  const totalCash = Object.values(cashByCurrency).reduce(
    (sum, v) => sum + safeNumber(v?.balance || v),
    0
  );

  const safePortfolioValue = safeNumber(portfolioValue);
  const safeTotalPL = safeNumber(totalPL);
  const safeUnrealizedPL = safeNumber(unrealizedPL);
  const safeRealizedPL = safeNumber(realizedPL);

  const totalValue = safePortfolioValue + totalCash;
  const plPercentage = safePortfolioValue > 0 ? (safeTotalPL / safePortfolioValue) * 100 : 0;

  return (
    <PageContainer>
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p className="subtitle">Real-time overzicht van je beleggingen</p>
        </div>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="dashboard-summary">
        <div className="summary-card-v2 card-primary">
          <div className="card-icon blue-gradient">
            <Wallet size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Totale waarde</span>
            <strong className="card-value">€ {totalValue.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
            <small className="card-meta">Inclusief cash</small>
          </div>
        </div>

        <div className="summary-card-v2">
          <div className="card-icon green-gradient">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Belegd vermogen</span>
            <strong className="card-value">€ {safePortfolioValue.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
            <small className="card-meta">{openPositions.length} posities</small>
          </div>
        </div>

        <div className="summary-card-v2">
          <div className="card-icon orange-gradient">
            <Banknote size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Cash</span>
            <strong className="card-value">€ {totalCash.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
            <small className="card-meta">
              {totalValue > 0 ? ((totalCash / totalValue) * 100).toFixed(1) : "0.0"}% allocatie
              {Object.keys(cashByCurrency).length > 1 && ` · ${Object.keys(cashByCurrency).length} valuta's`}
            </small>
          </div>
        </div>

        <div className={`summary-card-v2 ${safeTotalPL >= 0 ? 'card-positive' : 'card-negative'}`}>
          <div className={`card-icon ${safeTotalPL >= 0 ? 'success-gradient' : 'danger-gradient'}`}>
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <span className="card-label">Totale P/L</span>
            <strong className={`card-value ${safeTotalPL >= 0 ? "positive" : "negative"}`}>
              {safeTotalPL >= 0 ? '+' : ''}€ {safeTotalPL.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </strong>
            <small className="card-meta">
              {safeTotalPL >= 0 ? '+' : ''}{plPercentage.toFixed(2)}% · €{safeUnrealizedPL.toFixed(0)} ongereal. · €{safeRealizedPL.toFixed(0)} real.
            </small>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Portfolio wordt geladen...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* ===== CHARTS ROW ===== */}
          <div className="dashboard-grid-2col">
            {/* PERFORMANCE CHART */}
            {transactions.length > 0 && (
              <div className="dashboard-card">
                <div className="card-header-dash">
                  <h3>Performance</h3>
                  <span className="badge-info">Historisch</span>
                </div>
                <div className="card-body-dash">
                  <PortfolioPerformanceChart
                    transactions={transactions}
                    portfolioValue={portfolioValue}
                  />
                </div>
              </div>
            )}

            {/* ALLOCATION CHART */}
            {openPositions.length > 0 && (
              <div className="dashboard-card">
                <div className="card-header-dash">
                  <h3>Allocatie</h3>
                  <span className="badge-info">{openPositions.length} posities</span>
                </div>
                <div className="card-body-dash">
                  <PortfolioAllocationChart
                    positions={openPositions}
                    cash={totalCash}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ===== OPEN POSITIES ===== */}
          <div className="dashboard-card">
            <div className="card-header-dash">
              <h3>Open posities</h3>
              <span className="badge-primary">{openPositions.length}</span>
            </div>

            {openPositions.length === 0 ? (
              <div className="card-body-dash">
                <p className="muted">Geen open posities</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th className="right">Aantal</th>
                      <th className="right">Gem. koop</th>
                      <th className="right">Koers</th>
                      <th className="right">Waarde</th>
                      <th className="right">P/L</th>
                      <th className="right">P/L %</th>
                    </tr>
                  </thead>

                  <tbody>
                    {openPositions.map((p, i) => {
                      const quantity = Number(p.quantity || 0);
                      const avgBuy = Number(p.avgBuyPrice || 0);
                      const price = Number(p.price || avgBuy);
                      const marketValue = Number(p.marketValue || 0);
                      const costBasis = Number(p.costBasis || 0);
                      const profitLoss = Number(p.profitLoss || 0);
                      const plPct = Number(p.profitLossPct || 0);

                      const currencySymbol = p.currency === 'USD' ? '$' : '€';

                      return (
                        <tr key={i}>
                          <td>
                            <div className="asset-cell">
                              <StockLogo symbol={p.symbol} size={32} />
                              <div className="asset-cell-content">
                                <strong>{p.symbol || p.asset || "Onbekend"}</strong>
                                {p.currency === 'USD' && <span className="currency-badge">USD</span>}
                              </div>
                            </div>
                          </td>
                          <td className="right mono">{quantity.toLocaleString('nl-NL')}</td>
                          <td className="right mono">
                            {currencySymbol} {avgBuy.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className="right mono text-muted">
                            {currencySymbol} {price.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className="right mono font-semibold">
                            {currencySymbol} {marketValue.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className={`right mono font-semibold ${profitLoss >= 0 ? "text-success" : "text-danger"}`}>
                            {profitLoss >= 0 ? '+' : ''}{currencySymbol} {Math.abs(profitLoss).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className={`right mono font-semibold ${plPct >= 0 ? "text-success" : "text-danger"}`}>
                            {plPct >= 0 ? '+' : ''}{plPct.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ===== GESLOTEN POSITIES ===== */}
          {closedPositions.length > 0 && (
            <div className="dashboard-card">
              <div
                className="card-header-dash clickable"
                onClick={() => setShowClosedPositions(!showClosedPositions)}
              >
                <div className="header-left">
                  <h3>Gesloten posities</h3>
                  <span className="badge-secondary">{closedPositions.length}</span>
                </div>
                <button className="collapse-btn">
                  {showClosedPositions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              {showClosedPositions && <ClosedPositionsTable positions={closedPositions} />}
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
