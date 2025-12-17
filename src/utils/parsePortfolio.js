// src/utils/parsePortfolio.js

export function parsePortfolio(transactions) {
  const holdings = {};
  const history = [];

  transactions.forEach((t) => {
    const type = detectTransactionType(t);
    const isin = t.ISIN || null;
    const product = t.Product || null;
    const amount = normalizeNumber(t.Mutatie);
    const value = normalizeNumber(t._1);
    const fx = t.FX || null;
    const description = t.Omschrijving || "";

    history.push({ ...t, type });

    // Ignore unrelated transactions
    if (!isin && !product) return;

    // If a new holding appears
    if (!holdings[isin]) {
      holdings[isin] = {
        isin,
        product,
        quantity: 0,
        invested: 0,
        avgPrice: 0,
        currency: fx || "EUR",
        transactions: [],
      };
    }

    const h = holdings[isin];

    if (type === "BUY") {
      h.quantity += Math.abs(amount);
      h.invested += Math.abs(value);
    }

    if (type === "SELL") {
      h.quantity -= Math.abs(amount);
      h.invested -= Math.abs(value);
    }

    if (type === "FEE") {
      h.invested += Math.abs(value);
    }

    h.avgPrice =
      h.quantity > 0 ? Math.abs(h.invested / h.quantity) : 0;

    h.transactions.push({ ...t, type });
  });

  return {
    holdings: Object.values(holdings),
    history,
  };
}

// ------------------------------------------------------------
// Detect buy/sell/fee/cash etc.
// ------------------------------------------------------------
function detectTransactionType(t) {
  const d = (t.Omschrijving || "").toLowerCase();

  if (d.includes("koop") || d.includes("buy")) return "BUY";
  if (d.includes("verkoop") || d.includes("sale")) return "SELL";
  if (d.includes("transactiekosten") || d.includes("fee")) return "FEE";
  if (d.includes("valuta debitering")) return "FX_OUT";
  if (d.includes("valuta creditering")) return "FX_IN";
  if (d.includes("cash") || d.includes("sweep")) return "CASH";
  if (d.includes("overboeking")) return "TRANSFER";

  return "OTHER";
}

// Convert “1.234,56” → 1234.56
function normalizeNumber(v) {
  if (!v) return 0;
  return parseFloat(
    String(v)
      .replace(/\./g, "")
      .replace(",", ".")
  );
}
