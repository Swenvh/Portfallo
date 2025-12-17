import { parseTrade } from "./parseTrade";
import { extractSymbol } from "../utils/symbolExtractor";

export function buildPositionLedger(transactions = []) {
  const map = {};

  transactions.forEach(tx => {
    if (!tx.ISIN) return;

    const trade = parseTrade(tx.Omschrijving);
    if (!trade) return;

    if (!map[tx.ISIN]) {
      const productName = tx.Product || tx.Naam || tx.Instrument || "Onbekend";
      let symbol = tx.Symbol || tx.Ticker || extractSymbol(tx.ISIN, productName);

      if (!symbol || symbol === tx.ISIN) {
        console.warn(`[Position] No ticker found for ISIN: ${tx.ISIN}, using ISIN as fallback`);
        symbol = tx.ISIN;
      }

      console.log(`[Position] ISIN: ${tx.ISIN}, Product: ${productName}, Symbol: ${symbol}`);

      map[tx.ISIN] = {
        isin: tx.ISIN,
        asset: productName,
        symbol: symbol,
        currency: tx.Valuta || "EUR",

        buyQty: 0,
        buyValue: 0,
        sellQty: 0,
        sellValue: 0
      };
    }

    const p = map[tx.ISIN];

    if (trade.quantity > 0) {
      p.buyQty += trade.quantity;
      p.buyValue += trade.quantity * trade.price;
    } else {
      const qty = Math.abs(trade.quantity);
      p.sellQty += qty;
      p.sellValue += qty * trade.price;
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
