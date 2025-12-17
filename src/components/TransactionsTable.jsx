import React from "react";
import { toTradingViewSymbol } from "../utils/tradingViewSymbol";

export default function TransactionsTable({ transactions = [] }) {
  const list = Array.isArray(transactions) ? transactions : [];
  if (list.length === 0) {
    return <div className="bg-white p-4 rounded shadow text-sm text-gray-500">Geen transacties geladen.</div>;
  }
  return (
    <div className="bg-white p-4 rounded shadow overflow-x-auto">
      <h4 className="font-semibold mb-3">Transacties ({list.length})</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2">Datum</th>
            <th className="py-2">Omschrijving</th>
            <th className="py-2">Symbol</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Prijs</th>
            <th className="py-2 text-right">Bedrag</th>
            <th className="py-2">Valuta</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t, i) => (
            <tr key={t.id || i} className="border-b hover:bg-gray-50">
              <td className="py-2">{t.date} {t.time}</td>
              <td className="py-2">{t.product || (t.raw && (t.raw.Omschrijving||t.raw.Description)) || "-"}</td>
              <td className="py-2">{toTradingViewSymbol(t.symbol)}</td>
              <td className="py-2 text-right">{Number(t.qty || 0).toFixed(4)}</td>
              <td className="py-2 text-right">{t.price ? Number(t.price).toFixed(4) : "-"}</td>
              <td className="py-2 text-right">{Number(t.amount || 0).toFixed(2)}</td>
              <td className="py-2">{t.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
