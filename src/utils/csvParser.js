// src/utils/csvParser.js
// Volledige CSV parser met DEGIRO-validatie + ticker-detectie

import { detectTickerInfo } from "./detectTickerInfo";
import { validateDegiroUpload } from "./validateDegiroUpload";

// --- kleine CSV helper (ondersteunt quotes) ---
function splitCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map(v => v.trim());
}

export function parseCSV(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Leeg of ongeldig CSV-bestand");
  }

  // 1) regels normaliseren
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV bevat geen dataregels");
  }

  // 2) headers
  const headers = splitCSVLine(lines[0]);

  // 3) DEGIRO-validatie (mini-wijziging waar we het over hadden)
  const validation = validateDegiroUpload(headers);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  // 4) rows parsen
  const rows = lines.slice(1).map((line, id) => {
    const values = splitCSVLine(line);
    const record = {};

    headers.forEach((h, i) => {
      record[h] = values[i] ?? "";
    });

    // generieke (portfolio/overview) velden
    const name = record.name || record.product || record.Product || "Onbekend";
    const symbol = record.symbol || record.ticker || record.ISIN || "";

    const value = Number(String(record.value || record.Waarde || 0).replace(',', '.')) || 0;
    const pl = Number(String(record.pl || record.PnL || 0).replace(',', '.')) || 0;
    const change = Number(String(record.change || record.Verandering || 0).replace(',', '.')) || 0;

    const meta = detectTickerInfo(symbol);

    return {
      id,
      name,
      symbol,
      value,
      pl,
      change,
      sector: meta.sector,
      region: meta.region,
      class: meta.class,
      currency: meta.currency,
      weight: 0,
      __raw: record // handig voor debugging / classify
    };
  });

  // 5) gewicht herberekenen (% van totale waarde)
  const totalValue = rows.reduce((sum, r) => sum + (Number.isFinite(r.value) ? r.value : 0), 0);

  rows.forEach(r => {
    r.weight = totalValue
      ? Number(((r.value / totalValue) * 100).toFixed(2))
      : 0;
  });

  return rows;
}
