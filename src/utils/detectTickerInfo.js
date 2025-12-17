// src/utils/detectTickerInfo.js
import { TICKER_METADATA } from "../data/tickerData";

const SUFFIX_TO_REGION = {
  ".AS": { region: "EU", currency: "EUR" },   // Amsterdam
  ".DE": { region: "EU", currency: "EUR" },   // Duitsland
  ".PA": { region: "EU", currency: "EUR" },   // Frankrijk
  ".L":  { region: "EU", currency: "GBP" },   // Londen
  ".TO": { region: "Canada", currency: "CAD" },
  ".NS": { region: "India", currency: "INR" },
  ".HK": { region: "Azië", currency: "HKD" },
};

export function detectTickerInfo(raw = "") {
  if (!raw) return TICKER_METADATA.DEFAULT;

  const cleaned = raw.trim().toUpperCase();

  // 1. Exact match
  if (TICKER_METADATA[cleaned]) return TICKER_METADATA[cleaned];

  // 2. Detect suffix like AAPL.AS
  const parts = cleaned.split(".");
  const root = parts[0];
  const suffix = "." + parts[1];

  if (SUFFIX_TO_REGION[suffix]) {
    return {
      sector: TICKER_METADATA[root]?.sector || "Onbekend",
      class: TICKER_METADATA[root]?.class || "Aandeel",
      region: SUFFIX_TO_REGION[suffix].region,
      currency: SUFFIX_TO_REGION[suffix].currency,
    };
  }

  // 3. Root ticker fallback (AAPL.K → AAPL)
  if (TICKER_METADATA[root]) return TICKER_METADATA[root];

  // 4. Ultimate fallback
  return TICKER_METADATA.DEFAULT;
}
