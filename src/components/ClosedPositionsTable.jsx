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

            return (
              <tr key={p.isin || i}>
                <td>
                  <div className="asset-cell">
                    <strong>{p.symbol || p.asset || "Onbekend"}</strong>
                  </div>
                </td>

                <td className="right mono">
                  {Number(p.totalBoughtQty || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 4})}
                </td>

                <td className="right mono">
                  {Number(p.totalSoldQty || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 4})}
                </td>

                <td className="right mono">
                  € {Number(p.avgBuyPrice || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>

                <td className="right mono">
                  € {Number(p.avgSellPrice || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>

                <td className={`right mono font-semibold ${positive ? "text-success" : "text-danger"}`}>
                  {positive ? '+' : ''}€ {realizedPL.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
