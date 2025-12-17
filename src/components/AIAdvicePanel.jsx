// src/components/AIAdvicePanel.jsx
import React from "react";
import { usePremium } from "../context/PremiumContext";
import { toTradingViewSymbol } from "../utils/tradingViewSymbol";

export default function AIAdvicePanel({ holdings = [] }) {
  const premium = usePremium?.() || {};
  const { isPremium, setShowPaywall } = premium;

  if (!isPremium) {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-center">
        <h4 className="font-semibold mb-2">AI-advies (Pro)</h4>
        <p className="text-sm text-gray-600">Ontgrendel Pro voor gepersonaliseerde optimalisatie.</p>
        <button
          onClick={() => setShowPaywall && setShowPaywall(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Ontgrendel Pro
        </button>
      </div>
    );
  }

  // Basic mock recommendation (top overweight -> sell part)
  const recommendations = (holdings || []).slice(0,3).map(h => ({
    symbol: toTradingViewSymbol(h.symbol || h.ticker || h.name),
    action: "HERWEEK",
    reason: `Herbalanceer ${toTradingViewSymbol(h.symbol || h.name)}`,
    amount: (Number(h.value) || 0) * 0.05
  }));

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h4 className="font-semibold mb-2">AI Advies</h4>
      {recommendations.length === 0 ? (
        <div className="text-sm text-gray-600">Geen adviezen (geen data)</div>
      ) : (
        <ul className="space-y-2 text-sm">
          {recommendations.map((r, i) => (
            <li key={i} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{r.symbol}</div>
                <div className="text-xs text-gray-500">{r.reason}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">€ {Number(r.amount).toFixed(2)}</div>
                <div className="text-xs text-gray-500">{r.action}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
