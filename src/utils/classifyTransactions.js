export function classifyAndMerge(raw) {
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
    let total = 0;
    let currency = "EUR";
    let cashEUR = 0;
    let fxRate = null;

    group.forEach(r => {
      const desc = (r.Omschrijving || "").toLowerCase();
      const mutatie = parseCommaNumber(r.Mutatie || "0");
      const fx = r.FX || "";

      if (desc.includes("verkoop") || desc.includes("sell")) {
        type = "SELL";
        const matches = desc.match(/verkoop\s+(\d+)/i);
        if (matches) quantity = parseFloat(matches[1]);
        price = extractPrice(desc);
        currency = extractCurrency(desc, fx);
      }

      if (desc.includes("koop") || desc.includes("buy")) {
        type = "BUY";
        const matches = desc.match(/(koop|buy)\s+(\d+)/i);
        if (matches) quantity = parseFloat(matches[2]);
        price = extractPrice(desc);
        currency = extractCurrency(desc, fx);
      }

      if (desc.includes("transactiekost") || desc.includes("kosten")) {
        fee += Math.abs(mutatie);
      }

      cashEUR += mutatie;

      if (desc.includes("overboeking") || desc.includes("ideal deposit") || desc.includes("storting")) {
        if (!type) type = "CASH_TRANSFER";
      }

      if (desc.includes("dividend")) {
        if (!type) type = "DIVIDEND";
      }
    });

    if (type === "BUY" || type === "SELL") {
      total = quantity * price;

      if (total > 0 && cashEUR !== 0 && currency !== "EUR") {
        fxRate = Math.abs(cashEUR / total);
      }

      if (quantity === 0 || price === 0) {
        console.warn(`[classifyAndMerge] Invalid ${type} transaction:`, {
          asset,
          isin,
          quantity,
          price,
          description: base.Omschrijving
        });
        return;
      }

      result.push({
        date,
        time,
        type,
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
    } else if (type === "CASH_TRANSFER" || type === "DIVIDEND") {
      result.push({
        date,
        time,
        type,
        asset: "",
        isin: "",
        quantity: 0,
        price: 0,
        currency: "EUR",
        total: cashEUR,
        fee: 0,
        cashEUR,
        fxRate: null
      });
    }
  });

  return result;
}

function parseCommaNumber(str) {
  if (!str || str === "") return 0;

  const cleaned = String(str)
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const result = parseFloat(cleaned);
  return isNaN(result) ? 0 : result;
}

function extractPrice(desc) {
  const match = desc.match(/@\s*([0-9,.]+)/);
  if (!match) {
    const priceMatch = desc.match(/(\d+[.,]\d+)/);
    if (priceMatch) return parseCommaNumber(priceMatch[1]);
    return 0;
  }
  return parseCommaNumber(match[1]);
}

function extractCurrency(desc, fx = "") {
  const fxUpper = fx.toUpperCase();

  if (fxUpper.includes("USD") || desc.includes("usd")) return "USD";
  if (fxUpper.includes("GBP") || desc.includes("gbp")) return "GBP";
  if (fxUpper.includes("CHF") || desc.includes("chf")) return "CHF";
  if (fxUpper.includes("JPY") || desc.includes("jpy")) return "JPY";

  if (fxUpper && fxUpper.length >= 3) {
    const match = fxUpper.match(/([A-Z]{3})/);
    if (match) return match[1];
  }

  return "EUR";
}
