// src/components/AIAdvisor.jsx
import React, { useMemo, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

/**
 * AIAdvisor.jsx
 * - generateRecommendations() maakt 3 scenarios:
 *    - Low-Risk
 *    - Balanced
 *    - Growth
 * - Voor ieder scenario: berekent doelallocatie per asset (EUR), vervolgens
 *   berekent welke trades (buy/sell) nodig zijn om huidige -> doel te komen.
 *
 * UI:
 * - laat scenarios zien met impact, trades list, en "Simuleer toepassen" knop
 */

function euro(n) {
  return `€ ${Number(n || 0).toFixed(2)}`;
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export default function AIAdvisor() {
  const {
    positions = [],
    prices = {},
    cash = 0,
    totalValue = 0,
    risk = {}
  } = usePortfolio();

  const [simulatedPositions, setSimulatedPositions] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);

  // compute current position values (EUR-ish using lastPrice)
  const currentValues = useMemo(() => {
    const map = {};
    positions.forEach(p => {
      const val = (p.quantity || 0) * (p.lastPrice || 0);
      map[p.asset] = { asset: p.asset, isin: p.isin, qty: p.quantity, lastPrice: p.lastPrice, value: val, currency: p.currency };
    });
    return map;
  }, [positions]);

  const portfolioTotalApprox = useMemo(() => {
    const posSum = Object.values(currentValues).reduce((s, x) => s + (x.value || 0), 0);
    return posSum + (cash || 0);
  }, [currentValues, cash]);

  // helper to compute suggested target allocations (simple heuristics)
  function buildTargets(scenario) {
    // base: assets list
    const assets = Object.values(currentValues);
    const total = portfolioTotalApprox || 1;

    // compute current weights
    const weights = assets.map(a => ({ asset: a.asset, value: a.value, weight: (a.value || 0) / total }));

    // default equal weight among assets (if assets exist)
    const equalWeight = assets.length ? (1 / assets.length) : 0;

    let target = {}; // asset => fraction of portfolio (0..1)
    if (scenario === "Low-Risk") {
      // keep 50% cash, spread remaining equally
      const investFraction = 0.5;
      assets.forEach(a => target[a.asset] = investFraction * (1 / assets.length));
      return { target, cashTarget: 0.5 };
    }
    if (scenario === "Balanced") {
      // 20% cash, rest weighted by current weight but shrunk toward equal weighting
      const cashTarget = 0.20;
      const mix = 0.6; // 60% current weight, 40% equalize
      assets.forEach(a => {
        const currW = (a.value || 0) / total;
        const tw = mix * currW + (1 - mix) * equalWeight;
        target[a.asset] = (1 - cashTarget) * tw;
      });
      return { target, cashTarget: 0.20 };
    }
    if (scenario === "Growth") {
      // 5% cash, overweight top positions slightly (momentum bias)
      const cashTarget = 0.05;
      // boost current top assets by factor
      const sorted = assets.slice().sort((a,b)=>b.value-a.value);
      const boostTop = Math.min(0.25, 0.25); // up to +25% share redistributed
      // compute base weights from current, then amplify top 1-2
      const baseWeights = {};
      assets.forEach(a => baseWeights[a.asset] = (a.value || 0) / total);
      // boost top two
      if (sorted.length > 0) baseWeights[sorted[0].asset] += boostTop * 0.6;
      if (sorted.length > 1) baseWeights[sorted[1].asset] += boostTop * 0.4;
      // normalize
      const sumBase = Object.values(baseWeights).reduce((s,v)=>s+v,0) || 1;
      assets.forEach(a => target[a.asset] = (1 - cashTarget) * (baseWeights[a.asset] / sumBase));
      return { target, cashTarget };
    }
    // fallback equal
    assets.forEach(a => target[a.asset] = 1 / (assets.length || 1));
    return { target, cashTarget: 0.1 };
  }

  // generate trades required to move current -> target
  function computeTradesForScenario(scenarioKey) {
    const { target, cashTarget } = buildTargets(scenarioKey);
    const total = portfolioTotalApprox || 1;
    const desiredCash = cashTarget * total;

    // desired amounts per asset in EUR
    const desired = {};
    Object.keys(target).forEach(asset => {
      desired[asset] = target[asset] * total;
    });

    const trades = [];
    let cashLeft = cash; // available cash (EUR)
    // For each asset, compute diff
    Object.entries(currentValues).forEach(([asset, cur]) => {
      const curVal = cur.value || 0;
      const wantVal = desired[asset] || 0;
      const diff = Number((wantVal - curVal).toFixed(2)); // positive = buy, negative = sell
      const price = cur.lastPrice || 0;
      if (Math.abs(diff) < Math.max(1, 0.005 * total)) return; // ignore tiny diffs
      if (diff > 0) {
        // need to buy: compute qty
        const qty = price > 0 ? Math.floor((diff / price) * 1000000) / 1000000 : 0;
        const estCost = qty * price;
        trades.push({ action: "BUY", asset, qty, estCost, price, reason: `Increase to ${Math.round((wantVal/total)*100)}%`});
      } else {
        const qty = price > 0 ? Math.floor((Math.abs(diff) / price) * 1000000) / 1000000 : 0;
        const estProceeds = qty * price;
        trades.push({ action: "SELL", asset, qty, estProceeds, price, reason: `Reduce to ${Math.round((wantVal/total)*100)}%`});
      }
    });

    // quick cash delta estimate
    const estimatedCashDelta = trades.reduce((s, t) => s + (t.action === "BUY" ? -t.estCost : t.estProceeds || 0), 0);
    const finalCash = cash + estimatedCashDelta;

    // quick effect on risk: naive simulated topShare after trades
    const simulatedValues = { ...currentValues };
    trades.forEach(t => {
      const cur = simulatedValues[t.asset];
      const curVal = cur ? cur.value : 0;
      if (t.action === "BUY") simulatedValues[t.asset].value = curVal + (t.estCost || 0);
      else simulatedValues[t.asset].value = Math.max(0, curVal - (t.estProceeds || 0));
    });
    const newTotal = Object.values(simulatedValues).reduce((s,x)=>s+(x.value||0),0) + finalCash;
    const sorted = Object.values(simulatedValues).slice().sort((a,b)=>b.value-a.value);
    const newTopShare = newTotal ? (sorted[0]?.value || 0) / newTotal : 0;

    return {
      scenario: scenarioKey,
      target,
      cashTarget,
      trades,
      estimatedCashAfter: finalCash,
      newTopShare,
      newTotal
    };
  }

  const scenarios = useMemo(() => {
    return ["Low-Risk", "Balanced", "Growth"].map(k => computeTradesForScenario(k));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, cash, totalValue, prices]);

  function simulateApply(scenario) {
    // apply simulation locally: adjust quantities according to trades (no context mutation)
    const sim = JSON.parse(JSON.stringify(currentValues));
    scenario.trades.forEach(t => {
      const item = sim[t.asset];
      if (!item) return;
      if (t.action === "BUY") item.qty = Number(((item.qty || 0) + t.qty).toFixed(6));
      if (t.action === "SELL") item.qty = Number(((item.qty || 0) - t.qty).toFixed(6));
      item.value = item.qty * (item.lastPrice || 0);
    });
    setSimulatedPositions({ sim, cash: scenario.estimatedCashAfter });
    setSelectedScenario(scenario.scenario);
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">AI-adviseur</h3>
          <p className="text-sm text-gray-500">Simuleer rebalancing-scenario's & concrete trades</p>
        </div>
        <div>
          <button
            onClick={() => { setSimulatedPositions(null); setSelectedScenario(null); }}
            className="px-3 py-1 bg-gray-100 rounded"
          >
            Reset simulatie
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        {scenarios.map(s => (
          <div key={s.scenario} className="p-3 border rounded">
            <div className="flex justify-between items-baseline">
              <div className="font-semibold">{s.scenario}</div>
              <div className="text-sm text-gray-500">cash ≈ {euro(s.estimatedCashAfter)}</div>
            </div>
            <div className="text-xs text-gray-500 mt-1 mb-2">TopShare ≈ {Math.round((s.newTopShare||0)*100)}%</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => simulateApply(s)} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Simuleer</button>
              <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(s.trades, null, 2)); }} className="px-2 py-1 bg-gray-100 rounded text-sm">Kopieer trades</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        {selectedScenario && simulatedPositions && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Simulatie resultaat: {selectedScenario}</h4>
            <p className="text-sm text-gray-600">Geschatte cash: {euro(simulatedPositions.cash)}</p>
            <div className="mt-2 overflow-auto max-h-48">
              <table className="w-full text-sm">
                <thead className="text-left border-b">
                  <tr><th>Asset</th><th>Qty (nu)</th><th>Waarde (nu)</th></tr>
                </thead>
                <tbody>
                  {Object.values(simulatedPositions.sim).map((it) => (
                    <tr key={it.asset} className="border-b">
                      <td className="py-1">{it.asset}</td>
                      <td className="py-1">{Number(it.qty || 0).toFixed(6)}</td>
                      <td className="py-1">{euro(it.value || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* trade details */}
      <div>
        {scenarios.map(s => (
          <div key={`tr-${s.scenario}`} className="mb-4">
            <h5 className="font-semibold">{s.scenario} trades</h5>
            {s.trades.length === 0 && <p className="text-sm text-gray-500">Geen aanpassingen nodig</p>}
            <ul className="mt-2 space-y-2">
              {s.trades.map((t, i) => (
                <li key={i} className="p-2 border rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{t.action} {t.asset}</div>
                      <div className="text-xs text-gray-500">{t.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{t.qty} st</div>
                      <div className="text-xs text-gray-500">{euro(t.estCost || t.estProceeds || 0)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-3">
        <strong>Opmerking:</strong> Dit zijn gesimuleerde suggesties op basis van heuristieken (geen financieel advies). Controleer bedragen en kosten voordat je handelt.
      </div>
    </div>
  );
}
