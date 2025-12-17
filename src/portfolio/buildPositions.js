// src/portfolio/buildPositions.js

export function buildPositions(transactions = []) {
  const map = {};

  for (const t of transactions) {
    const key = t.isin || t.symbol;
    if (!key) continue;

    const qty = Number(t.quantity || 0);
    const price = Number(t.price || 0);

    if (!map[key]) {
      map[key] = {
        isin: t.isin,
        asset: t.asset,
        symbol: t.symbol,
        currency: t.currency,

        buyQty: 0,
        sellQty: 0,
        buyValue: 0
      };
    }

    if (t.type === "BUY") {
      map[key].buyQty += qty;
      map[key].buyValue += qty * price;
    }

    if (t.type === "SELL") {
      map[key].sellQty += qty;
    }
  }

  return Object.values(map)
    // 🔥 OPEN = meer gekocht dan verkocht
    .filter(p => p.buyQty > p.sellQty)
    .map(p => {
      const netQty = p.buyQty - p.sellQty;
      const avgBuyPrice = p.buyValue / p.buyQty;

      return {
        isin: p.isin,
        asset: p.asset,
        symbol: p.symbol,
        currency: p.currency,

        quantity: netQty,
        avgBuyPrice
      };
    });
}
