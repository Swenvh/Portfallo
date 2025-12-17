// src/pages/DashboardPage.jsx
import PageContainer from "../components/PageContainer";
import PortfolioAllocationChart from "../components/PortfolioAllocationChart";
import PortfolioPerformanceChart from "../components/PortfolioPerformanceChart";
import ClosedPositionsTable from "../components/ClosedPositionsTable";
import { usePortfolio } from "../context/PortfolioContext";

// ✅ Alleen formatting – GEEN logica
function formatMoney(value, currency = "EUR") {
  const symbol = currency === "USD" ? "$" : "€";
  return `${symbol} ${Number(value || 0).toFixed(2)}`;
}

export default function DashboardPage() {
  const { portfolio, loading, transactions } = usePortfolio();

  if (!portfolio && !loading) {
    return (
      <PageContainer>
        <h2>Dashboard</h2>
        <p className="muted">Upload een CSV om te beginnen</p>
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

  const eurCash = Number(cashByCurrency?.EUR?.balance || 0);
  const totalValue = portfolioValue + eurCash;

  return (
    <PageContainer>
      <h2>Dashboard</h2>
      <p className="subtitle">Overzicht van je portefeuille</p>

      {/* ===== KPI ===== */}
      <div className="dashboard-summary modern-grid">
        <div className="summary-card primary">
          <span>Totale waarde</span>
          <strong>€ {totalValue.toFixed(2)}</strong>
          <small>Inclusief cash</small>
        </div>

        <div className="summary-card">
          <span>Belegd vermogen</span>
          <strong>€ {portfolioValue.toFixed(2)}</strong>
          <small>{openPositions.length} open posities</small>
        </div>

        <div className="summary-card">
          <span>Cash (EUR)</span>
          <strong>€ {eurCash.toFixed(2)}</strong>
          <small>
            {totalValue > 0
              ? ((eurCash / totalValue) * 100).toFixed(1)
              : "0.0"}
            % allocatie
          </small>
        </div>

        <div className="summary-card">
          <span>Totale P/L</span>
          <strong className={totalPL >= 0 ? "positive" : "negative"}>
            € {totalPL.toFixed(2)}
          </strong>
          <small>
            € {unrealizedPL.toFixed(2)} ongerealiseerd · € {realizedPL.toFixed(2)} gerealiseerd
          </small>
        </div>
      </div>

      {loading && <p className="muted">⏳ Portfolio wordt geladen…</p>}

      {!loading && (
        <>
          {/* ===== PERFORMANCE ===== */}
          {transactions.length > 0 && (
            <div className="chart-section">
              <h3>Performance</h3>
              <PortfolioPerformanceChart
                transactions={transactions}
                portfolioValue={portfolioValue}
              />
            </div>
          )}

          {/* ===== ALLOCATIE ===== */}
          {openPositions.length > 0 && (
            <div className="chart-section">
              <h3>Portefeuille verdeling</h3>
              <PortfolioAllocationChart
                positions={openPositions}
                cash={eurCash}
              />
            </div>
          )}

          {/* ===== CASH ===== */}
          <div className="cash-section">
            <h3>Cash</h3>

            {Object.keys(cashByCurrency).length === 0 ? (
              <p className="muted">Geen cash transacties gevonden</p>
            ) : (
              <div className="cash-grid modern">
                {Object.entries(cashByCurrency).map(([currency, data]) => {
                  const value = Number(data?.balance || 0);
                  return (
                    <div
                      key={currency}
                      className={`cash-card modern ${value >= 0 ? "positive" : "negative"}`}
                    >
                      <span>{currency}</span>
                      <strong>{formatMoney(Math.abs(value), currency)}</strong>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ===== OPEN POSITIES ===== */}
          <div className="positions-section">
            <h3>Open posities</h3>

            {openPositions.length === 0 ? (
              <p className="muted">Geen open posities</p>
            ) : (
              <div className="dashboard-table">
                <table>
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
                      const price = Number(p.price ?? p.marketPrice ?? 0);

                      const cost = quantity * avgBuy;
                      const marketValue = quantity * price;
                      const pl = marketValue - cost;
                      const plPct = cost !== 0 ? (pl / cost) * 100 : 0;

                      return (
                        <tr key={i}>
                          <td>
                            <strong>{p.symbol || p.asset || "Onbekend"}</strong>
                          </td>
                          <td className="right mono">{quantity}</td>
                          <td className="right mono">
                            {formatMoney(avgBuy, p.currency)}
                          </td>
                          <td className="right mono muted">
                            {formatMoney(price, p.currency)}
                          </td>
                          <td className="right mono">
                            {formatMoney(marketValue, p.currency)}
                          </td>
                          <td
                            className={`right mono ${pl >= 0 ? "positive" : "negative"}`}
                          >
                            {formatMoney(pl, p.currency)}
                          </td>
                          <td
                            className={`right mono ${plPct >= 0 ? "positive" : "negative"}`}
                          >
                            {plPct.toFixed(2)}%
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
          <ClosedPositionsTable positions={closedPositions} />
        </>
      )}
    </PageContainer>
  );
}
