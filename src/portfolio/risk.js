// src/utils/risk.js
// Risico-analyse helpers (deterministisch, uitlegbaar)

export function totalValue(holdings = []) {
  return holdings.reduce((s, h) => s + (Number(h.value) || 0), 0);
}

// compute exposure per sector, region, currency
export function aggregateByKey(holdings = [], key = "sector") {
  const map = {};
  holdings.forEach(h => {
    const k = h[key] || "Onbekend";
    map[k] = (map[k] || 0) + (Number(h.value) || 0);
  });
  const total = totalValue(holdings);
  return Object.entries(map).map(([name, amount]) => ({
    name,
    amount,
    pct: total ? (amount / total) * 100 : 0
  })).sort((a,b) => b.pct - a.pct);
}

// concentration metrics
export function topNConcentration(holdings = [], n = 3) {
  const sorted = [...holdings].sort((a,b) => (b.value||0) - (a.value||0));
  const total = totalValue(holdings);
  const top = sorted.slice(0,n);
  const topSum = top.reduce((s,h)=>s+(Number(h.value)||0),0);
  return {
    top,
    topSum,
    topPct: total ? (topSum/total)*100 : 0
  };
}

// compute diversification score 0..100 (higher is better)
// heuristic: many small positions -> higher. Few large -> lower.
// We'll use entropy-like approach + #positions.
export function diversificationScore(holdings = []) {
  const total = totalValue(holdings);
  if (!total || holdings.length === 0) return 0;
  // distribution vector (pct)
  const p = holdings.map(h => (Number(h.value)||0)/total).filter(x=>x>0);
  // Shannon entropy
  const entropy = -p.reduce((s, x) => s + (x * Math.log2(x)), 0);
  // normalize max entropy for n items = log2(n)
  const maxEntropy = Math.log2(p.length || 1);
  const normEntropy = maxEntropy ? (entropy / maxEntropy) : 0;
  // also factor number of holdings (cap at 30)
  const countScore = Math.min(holdings.length, 30) / 30;
  // weighted
  const score = (normEntropy * 0.7 + countScore * 0.3) * 100;
  return Number(score.toFixed(0));
}

// overall risk score 0..100 (higher = riskier)
// combine: largest holding %, largest sector %, diversification inverse
export function overallRiskScore(holdings = []) {
  if (!holdings || holdings.length === 0) return 0;
  const total = totalValue(holdings);
  const sorted = [...holdings].sort((a,b) => (b.value||0)-(a.value||0));
  const largest = sorted[0];
  const largestPct = total ? (largest.value/total)*100 : 0;

  const sectors = aggregateByKey(holdings, "sector");
  const topSectorPct = sectors.length ? sectors[0].pct : 0;

  const divScore = diversificationScore(holdings);

  // Risk formula:
  // base from largestPct and topSectorPct and inverse diversification
  const score = (largestPct * 0.5) + (topSectorPct * 0.4) + ((100 - divScore) * 0.6 * 0.1);
  // normalize to 0..100 roughly
  const normalized = Math.min(100, Math.max(0, Number(score.toFixed(0))));
  return normalized;
}

// simple flags: too concentrated, currency risk, few positions
export function riskFlags(holdings = []) {
  const res = { tooConcentrated: false, highSectorConcentration: false, currencyConcentration: [], fewPositions: false };

  const { topPct } = topNConcentration(holdings, 1);
  if (topPct >= 20) res.tooConcentrated = true; // single holding >20% portfolio

  const sectors = aggregateByKey(holdings, "sector");
  if (sectors.length && sectors[0].pct >= 40) res.highSectorConcentration = true; // top sector >40%

  // currency exposure
  const currencies = aggregateByKey(holdings, "currency");
  res.currencyConcentration = currencies.filter(c => c.pct >= 40).map(c => ({ currency: c.name, pct: Number(c.pct.toFixed(1)) }));

  if ((holdings.length || 0) < 5) res.fewPositions = true;

  return res;
}
