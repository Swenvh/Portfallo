// CLASSIFY + MERGE DEGIRO-STYLE TRANSACTIONS
export function classifyAndMerge(raw) {
  // Stap 1: groepeer regels per orderId (of fallback: per timestamp + product)
  const groups = {};

  raw.forEach(r => {
    const orderId = r["Order Id"] || `${r["Datum"]}_${r["Tijd"]}_${r["Product"]}`;
    if (!groups[orderId]) groups[orderId] = [];
    groups[orderId].push(r);
  });

  const result = [];

  Object.values(groups).forEach(group => {
    const base = group[0];

    const asset = base.Product || "";
    const isin = base.ISIN || "";
    const date = base.Datum;
    const time = base.Tijd;

    let type = null;
    let quantity = 0;
    let price = 0;
    let fee = 0;
    let total = 0; // waarde in asset currency
    let currency = null;
    let cashEUR = 0; // effect op EUR cash
    let fxRate = null;

    group.forEach(r => {
      const desc = (r.Omschrijving || "").toLowerCase();
      const mut = r.Mutatie;
      const saldo = r.Saldo;
      const curr = saldo || r.FX || null;

      // ---- AANKOOP / VERKOOP ----
      if (desc.includes("verkoop") || desc.includes("sell")) {
        type = "SELL";
        const matches = desc.match(/verkoop\s+(\d+)/i);
        if (matches) quantity = parseFloat(matches[1]);
        price = extractPrice(desc);
        currency = extractCurrency(desc);
        total = Math.abs(parseCommaNumber(r["_1"]));
      }

      if (desc.includes("koop") || desc.includes("buy")) {
        type = "BUY";
        const matches = desc.match(/(koop|buy)\s+(\d+)/i);
        if (matches) quantity = parseFloat(matches[2]);
        price = extractPrice(desc);
        currency = extractCurrency(desc);
        total = Math.abs(parseCommaNumber(r["_1"]));
      }

      // ---- FX DEBIT ----
      if (desc.includes("valuta debitering")) {
        const value = parseCommaNumber(r["_1"]);
        // bv -1076,25 USD
        // asset-waarde
        total = Math.abs(value);
      }

      // ---- FX CREDIT ----
      if (desc.includes("valuta creditering")) {
        const value = parseCommaNumber(r["_1"]);
        cashEUR += value; // opbrengst in EUR na FX
      }

      // ---- KOSTEN ----
      if (desc.includes("transactiekost") || desc.includes("kosten")) {
        const value = parseCommaNumber(r["_1"]);
        fee += Math.abs(value);
        cashEUR -= Math.abs(value);
      }

      // ---- CASH STORTING / OPNAME ----
      if (desc.includes("overboeking")) {
        type = "CASH_TRANSFER";
        cashEUR += parseCommaNumber(r["_1"]);
      }
    });

    // fxRate reconstrueren (optioneel)
    if (total > 0 && cashEUR !== 0 && currency === "USD") {
      fxRate = Math.abs(cashEUR / total);
    }

    result.push({
      date,
      time,
      type: type || "UNKNOWN",
      asset,
      isin,
      quantity,
      price,
      currency,
      total,
      fee,
      cashEUR,
      fxRate
    });
  });

  return result;
}

// Helpers
function parseCommaNumber(str) {
  if (!str) return 0;
  return parseFloat(String(str).replace(".", "").replace(",", "."));
}

function extractPrice(desc) {
  const match = desc.match(/@ ([0-9]+,[0-9]+)/);
  if (!match) return 0;
  return parseCommaNumber(match[1]);
}

function extractCurrency(desc) {
  if (desc.includes("usd")) return "USD";
  if (desc.includes("eur")) return "EUR";
  return null;
}
