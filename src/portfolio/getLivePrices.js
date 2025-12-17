import { ISIN_TO_TICKER } from "./isinToTicker";

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY;

/**
 * Verrijkt posities met:
 * - price (live of fallback)
 * - marketValue
 */
export async function getLivePrices(positions) {
  // 🔒 Geen API key → veilige fallback
  if (!FINNHUB_KEY) {
    console.warn("⚠️ Geen Finnhub API key gevonden, fallback actief");
    return positions.map(p => ({
      ...p,
      price: p.avgPrice,
      marketValue: p.avgPrice * p.quantity
    }));
  }

  const results = [];

  for (const p of positions) {
    const ticker = ISIN_TO_TICKER[p.isin];

    // ❗ Geen ticker → fallback op avgPrice
    if (!ticker) {
      results.push({
        ...p,
        price: p.avgPrice,
        marketValue: p.avgPrice * p.quantity
      });
      continue;
    }

    try {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`
      );

      const data = await res.json();

      // Finnhub: c = current price
      const livePrice =
        typeof data?.c === "number" && data.c > 0
          ? data.c
          : p.avgPrice;

      results.push({
        ...p,
        price: livePrice,
        marketValue: livePrice * p.quantity
      });
    } catch (err) {
      console.error(
        `❌ Price fetch error for ${ticker} (${p.isin})`,
        err
      );

      results.push({
        ...p,
        price: p.avgPrice,
        marketValue: p.avgPrice * p.quantity
      });
    }
  }

  return results;
}
