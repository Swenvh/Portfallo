// src/components/RebalancePanel.jsx
import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { usePremium } from "../context/PremiumContext";
import { toTradingViewSymbol } from "../utils/tradingViewSymbol";

export default function RebalancePanel() {
  const portfolio = usePortfolio?.() || {};
  const { holdings = [] } = portfolio;
  const premium = usePremium?.() || {};
  const { isPremium, setShowPaywall } = premium;

  // simple mock: if top holding > 20% suggest partial sell
  const top = holdings && holdings.length ? holdings.slice().sort((a,b)=> (b.value||0)-(a.value||0))[0] : null;
  const suggestions = [];
  if (top && (top.value || 0) > 0) {
    const total = holdings.reduce((s,h)=> s + (Number(h.value)||0), 0) || 1;
    const pct = (top.value / total) * 100;
    if (pct > 20) {
      suggestions.push({
        symbol: toTradingViewSymbol(top.symbol || top.name),
        action: "Sell",
        reason: `Top positie is ${pct.toFixed(1)}%`
      });
    }
  }

  if (!isPremium && suggestions.length > 0) {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-center">
        <div className="font-semibold mb-2">Rebalance Voorstel (Pro)</div>
        <div className="text-sm text-gray-600">Ontgrendel Pro om volledige acties te zien</div>
        <button onClick={() => setShowPaywall && setShowPaywall(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Ontgrendel Pro</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h4 className="font-semibold mb-3">Rebalance suggesties</h4>
      {suggestions.length === 0 ? (
        <div className="text-sm text-gray-600">Geen suggesties</div>
      ) : (
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="flex justify-between">
              <div>
                <div className="font-medium">{s.symbol}</div>
                <div className="text-xs text-gray-500">{s.reason}</div>
              </div>
              <div className="text-sm text-gray-700 font-semibold">{s.action}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
