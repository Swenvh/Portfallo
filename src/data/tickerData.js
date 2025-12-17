// src/data/tickerData.js

export const TICKER_METADATA = {

  // ------------------------
  // 🇺🇸 Amerikaanse Tech
  // ------------------------
  AAPL: { sector: "Informatietechnologie", class: "Aandeel", region: "VS", currency: "USD" },
  MSFT: { sector: "Informatietechnologie", class: "Aandeel", region: "VS", currency: "USD" },
  META: { sector: "Communicatiediensten", class: "Aandeel", region: "VS", currency: "USD" },
  GOOG: { sector: "Communicatiediensten", class: "Aandeel", region: "VS", currency: "USD" },
  NVDA: { sector: "Informatietechnologie", class: "Aandeel", region: "VS", currency: "USD" },
  TSLA: { sector: "Consumentengoederen", class: "Aandeel", region: "VS", currency: "USD" },
  AMD: { sector: "Informatietechnologie", class: "Aandeel", region: "VS", currency: "USD" },

  // ------------------------
  // 🇪🇺 Europa
  // ------------------------
  ASML: { sector: "Informatietechnologie", class: "Aandeel", region: "EU", currency: "EUR" },
  ADYEN: { sector: "Financiële diensten", class: "Aandeel", region: "EU", currency: "EUR" },
  SHEL: { sector: "Energie", class: "Aandeel", region: "EU", currency: "GBP" },
  RDSA: { sector: "Energie", class: "Aandeel", region: "EU", currency: "EUR" },

  // ------------------------
  // 🇯🇵 Japan
  // ------------------------
  SONY: { sector: "Communicatiediensten", class: "Aandeel", region: "Azië", currency: "JPY" },
  TOYOTA: { sector: "Industrie", class: "Aandeel", region: "Azië", currency: "JPY" },

  // ------------------------
  // 🌍 Wereldwijde ETF's
  // ------------------------
  VWRL: { sector: "Wereldwijd Aandelen", class: "ETF", region: "Wereld", currency: "USD" },
  VWCE: { sector: "Wereldwijd Aandelen", class: "ETF", region: "Wereld", currency: "EUR" },
  IWDA: { sector: "Wereldwijd Aandelen", class: "ETF", region: "Wereld", currency: "USD" },
  EUNL: { sector: "Wereldwijd Aandelen", class: "ETF", region: "Wereld", currency: "EUR" },

  // ------------------------
  // 🪙 Crypto
  // ------------------------
  BTC: { sector: "Crypto", class: "Crypto", region: "Wereld", currency: "USD" },
  ETH: { sector: "Crypto", class: "Crypto", region: "Wereld", currency: "USD" },
  SOL: { sector: "Crypto", class: "Crypto", region: "Wereld", currency: "USD" },

  // ------------------------
  // 🛢️ Commodities
  // ------------------------
  XAU: { sector: "Grondstoffen", class: "Commodity", region: "Wereld", currency: "USD" },
  XAG: { sector: "Grondstoffen", class: "Commodity", region: "Wereld", currency: "USD" },

  // ------------------------
  // ⚠️ Fallback
  // ------------------------
  DEFAULT: { sector: "Onbekend", class: "Onbekend", region: "Onbekend", currency: "EUR" }
};
