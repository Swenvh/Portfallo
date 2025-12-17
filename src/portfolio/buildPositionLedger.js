import { extractSymbol } from "../utils/symbolExtractor";

export function buildPositionLedger(rawTransactions = [], classifiedTransactions = []) {
  const map = {};

  classifiedTransactions.forEach(ct => {
    if (!ct.isin || (ct.type !== "BUY" && ct.type !== "SELL")) return;

    if (!map[ct.isin]) {
      const productName = ct.asset || "Onbekend";
      let symbol = extractSymbol(ct.isin, productName);

      if (!symbol || symbol === ct.isin) {
        const rawTx = rawTransactions.find(tx => tx.ISIN === ct.isin);
        if (rawTx) {
          symbol = rawTx.Symbol || rawTx.Ticker || symbol;
        }
        if (!symbol || symbol === ct.isin) {
          console.warn(`[Position] No ticker found for ISIN: ${ct.isin}, using ISIN as fallback`);
          symbol = ct.isin;
        }
      }

      console.log(`[Position] ISIN: ${ct.isin}, Product: ${productName}, Symbol: ${symbol}`);

      map[ct.isin] = {
        isin: ct.isin,
        asset: productName,
        symbol: symbol,
        currency: ct.currency || "EUR",

        buyQty: 0,
        buyValue: 0,
        sellQty: 0,
        sellValue: 0
      };
    }

    const p = map[ct.isin];

    if (ct.type === "BUY") {
      p.buyQty += ct.quantity;
      p.buyValue += ct.total + ct.fee;
    } else if (ct.type === "SELL") {
      p.sellQty += ct.quantity;
      p.sellValue += ct.total - ct.fee;
    }
  });

  return Object.values(map).map(p => {
    const quantity = p.buyQty - p.sellQty;
    const avgBuyPrice = p.buyQty ? p.buyValue / p.buyQty : 0;
    const avgSellPrice = p.sellQty ? p.sellValue / p.sellQty : 0;

    return {
      isin: p.isin,
      asset: p.asset,
      symbol: p.symbol,
      currency: p.currency,

      quantity,

      buyQty: p.buyQty,
      sellQty: p.sellQty,

      avgBuyPrice,
      avgSellPrice,

      realizedPL: p.sellValue - p.sellQty * avgBuyPrice,

      status: quantity === 0 ? "CLOSED" : "OPEN"
    };
  });
}
