import React from "react";
import StockLogo from "./StockLogo";
import { toTradingViewSymbol } from "../utils/tradingViewSymbol";

export default function HoldingsTable({ holdings = [] }) {
  const list = Array.isArray(holdings) ? holdings : [];

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <h4 className="font-semibold mb-3">Posities</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2">Asset</th>
            <th className="py-2 text-right">Aantal</th>
            <th className="py-2 text-right">Laatste prijs</th>
            <th className="py-2 text-right">Waarde</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr><td colSpan={4} className="py-6 text-center text-gray-400">Geen posities</td></tr>
          )}
          {list.map((h, i) => (
            <tr key={h.id || i} className="border-b hover:bg-gray-50">
              <td className="py-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StockLogo symbol={h.symbol} size={28} />
                  <div>
                    <div className="font-medium">{toTradingViewSymbol(h.symbol)}</div>
                    <div className="text-xs text-gray-500">{h.name}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 text-right">{Number(h.qty||0).toFixed(4)}</td>
              <td className="py-3 text-right">{Number(h.lastPrice||0).toFixed(4)} {h.currency}</td>
              <td className="py-3 text-right">€ {Number(h.value||0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
