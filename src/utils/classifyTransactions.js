export function classifyAndMerge(raw) {
  const groups = {};

  raw.forEach(r => {
    const record = r.__raw || r;
    const orderId = record["Order Id"] || `${record["Datum"]}_${record["Tijd"]}_${record["Product"]}`;
    if (!groups[orderId]) groups[orderId] = [];
    groups[orderId].push(record);
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
    let currency = null;
    let cashEUR = 0;
    let fxRate = null;

    group.forEach(r => {
      const desc = (r.Omschrijving || "").toLowerCase();
      const mutatie = parseCommaNumber(r.Mutatie || "0");

      if (desc.includes("verkoop") || desc.includes("sell")) {
        type = "SELL";
        const matches = desc.match(/verkoop\s+(\d+)/i);
        if (matches) quantity = parseFloat(matches[1]);
        price = extractPrice(desc);
        currency = extractCurrency(desc);
        total = Math.abs(mutatie);
      }

      if (desc.includes("koop") || desc.includes("buy")) {
        type = "BUY";
        const matches = desc.match(/(koop|buy)\s+(\d+)/i);
        if (matches) quantity = parseFloat(matches[2]);
        price = extractPrice(desc);
        currency = extractCurrency(desc);
        total = Math.abs(mutatie);
      }

      if (desc.includes("valuta debitering")) {
        if (currency === "USD" || currency === "GBP") {
          total = Math.abs(mutatie);
        }
      }

      if (desc.includes("valuta creditering")) {
        cashEUR += mutatie;
      }

      if (desc.includes("transactiekost") || desc.includes("kosten")) {
        fee += Math.abs(mutatie);
        cashEUR -= Math.abs(mutatie);
      }

      if (desc.includes("overboeking") || desc.includes("ideal deposit") || desc.includes("storting")) {
        type = "CASH_TRANSFER";
        cashEUR += mutatie;
      }

      if (desc.includes("dividend")) {
        type = "DIVIDEND";
        cashEUR += mutatie;
      }
    });

    if (total > 0 && Math.abs(cashEUR) > 0 && currency && currency !== "EUR") {
      fxRate = Math.abs(cashEUR / total);
    }

    if (type === "BUY" || type === "SELL") {
      result.push({
        date,
        time,
        type,
        asset,
        isin,
        quantity,
        price,
        currency: currency || "EUR",
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
  if (!str) return 0;
  return parseFloat(String(str).replace(".", "").replace(",", "."));
}

function extractPrice(desc) {
  const match = desc.match(/@\s*([0-9,.]+)/);
  if (!match) return 0;
  return parseCommaNumber(match[1]);
}

function extractCurrency(desc) {
  if (desc.includes("usd")) return "USD";
  if (desc.includes("gbp")) return "GBP";
  if (desc.includes("eur")) return "EUR";
  return null;
}
