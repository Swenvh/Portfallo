import React from "react";

export default function ClosedPositionsTable({ positions = [] }) {
  const list = Array.isArray(positions) ? positions : [];

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mt-8">
      <h4 className="font-semibold mb-3">Gesloten posities</h4>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2">Asset</th>
            <th className="py-2 text-right">Gekocht</th>
            <th className="py-2 text-right">Verkocht</th>
            <th className="py-2 text-right">Gem. koop</th>
            <th className="py-2 text-right">Gem. verkoop</th>
            <th className="py-2 text-right">Resultaat</th>
            <th className="py-2 text-right">P/L %</th>
          </tr>
        </thead>

        <tbody>
          {list.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="py-6 text-center text-gray-400"
              >
                Geen gesloten posities
              </td>
            </tr>
          )}

          {list.map((p, i) => {
            const realizedPL = Number(p.realizedPL || 0);
            const realizedPLPct = Number(p.realizedPLPct || 0);
            const positive = realizedPL >= 0;

            return (
              <tr
                key={p.isin || i}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 font-medium">
                  {p.symbol || p.asset || "Onbekend"}
                </td>

                <td className="py-3 text-right mono">
                  {Number(p.totalBoughtQty || 0).toFixed(4)}
                </td>

                <td className="py-3 text-right mono">
                  {Number(p.totalSoldQty || 0).toFixed(4)}
                </td>

                <td className="py-3 text-right mono">
                  € {Number(p.avgBuyPrice || 0).toFixed(2)}
                </td>

                <td className="py-3 text-right mono">
                  € {Number(p.avgSellPrice || 0).toFixed(2)}
                </td>

                <td
                  className={`py-3 text-right mono font-medium ${
                    positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  € {realizedPL.toFixed(2)}
                </td>

                <td
                  className={`py-3 text-right mono ${
                    positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {realizedPLPct.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
