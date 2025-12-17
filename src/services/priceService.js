// src/services/priceService.js

export async function fetchPrices(tickers) {
  if (!tickers || tickers.length === 0) return {};

  const symbols = tickers.join(",");
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

  const res = await fetch(url);
  const data = await res.json();

  const result = {};

  data.quoteResponse.result.forEach(item => {
    result[item.symbol] = {
      price: item.regularMarketPrice,
      currency: item.currency,
      change: item.regularMarketChangePercent
    };
  });

  return result;
}
