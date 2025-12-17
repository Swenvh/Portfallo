import StockLogo from './StockLogo';
import { toTradingViewSymbol } from '../utils/tradingViewSymbol';

export default function ClosedPositionsTable({ positions = [] }) {
  const list = Array.isArray(positions) ? positions : [];

  if (list.length === 0) {
    return null;
  }

  return (
    <div className="table-container">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th className="right">Gekocht</th>
            <th className="right">Verkocht</th>
            <th className="right">Gem. koop</th>
            <th className="right">Gem. verkoop</th>
            <th className="right">Resultaat</th>
            <th className="right">P/L %</th>
          </tr>
        </thead>

        <tbody>
          {list.map((p, i) => {
            const realizedPL = Number(p.realizedPL || 0);
            const realizedPLPct = Number(p.realizedPLPct || 0);
            const positive = realizedPL >= 0;
            const currencySymbol = p.currency === 'USD' ? '$' : '€';

            return (
              <tr key={p.isin || i}>
                <td>
                  <div className="asset-cell">
                    <StockLogo symbol={p.symbol} size={32} />
                    <div className="asset-cell-content">
                      <strong>{toTradingViewSymbol(p.symbol || p.asset || "Onbekend")}</strong>
                      {p.currency === 'USD' && <span className="currency-badge">USD</span>}
                    </div>
                  </div>
                </td>

                <td className="right mono">
                  {Number(p.totalBoughtQty || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 4})}
                </td>

                <td className="right mono">
                  {Number(p.totalSoldQty || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 4})}
                </td>

                <td className="right mono">
                  {currencySymbol} {Number(p.avgBuyPrice || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>

                <td className="right mono">
                  {currencySymbol} {Number(p.avgSellPrice || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>

                <td className={`right mono font-semibold ${positive ? "text-success" : "text-danger"}`}>
                  {positive ? '+' : ''}{currencySymbol} {Math.abs(realizedPL).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>

                <td className={`right mono font-semibold ${positive ? "text-success" : "text-danger"}`}>
                  {positive ? '+' : ''}{realizedPLPct.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
