// src/portfolio/buildClosedPositions.js

export function buildClosedPositions(transactions = []) {
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
        buyValue: 0,
        sellValue: 0
      };
    }

    if (t.type === "BUY") {
      map[key].buyQty += qty;
      map[key].buyValue += qty * price;
    }

    if (t.type === "SELL") {
      map[key].sellQty += qty;
      map[key].sellValue += qty * price;
    }
  }

  return Object.values(map)
    // 🔥 CLOSED = exact evenveel gekocht als verkocht
    .filter(p => p.buyQty > 0 && p.buyQty === p.sellQty)
    .map(p => {
      const avgBuy = p.buyValue / p.buyQty;
      const avgSell = p.sellValue / p.sellQty;
      const realizedPL = p.sellValue - p.buyValue;
      const realizedPLPct =
        p.buyValue > 0 ? (realizedPL / p.buyValue) * 100 : 0;

      return {
        isin: p.isin,
        asset: p.asset,
        symbol: p.symbol,
        currency: p.currency,

        totalBoughtQty: p.buyQty,
        totalSoldQty: p.sellQty,

        avgBuyPrice: avgBuy,
        avgSellPrice: avgSell,

        realizedPL,
        realizedPLPct
      };
    });
}
