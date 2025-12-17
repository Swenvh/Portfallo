// src/portfolio/buildPositionLedger.js
import { parseTrade } from "./parseTrade";

export function buildPositionLedger(transactions = []) {
  const map = {};

  transactions.forEach(tx => {
    if (!tx.ISIN) return;

    const trade = parseTrade(tx.Omschrijving);
    if (!trade) return;

    if (!map[tx.ISIN]) {
      map[tx.ISIN] = {
        isin: tx.ISIN,
        asset:
          tx.Product ||
          tx.Naam ||
          tx.Instrument ||
          "Onbekend",
        symbol: tx.Symbol || tx.Ticker || null,
        currency: tx.Valuta,

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
