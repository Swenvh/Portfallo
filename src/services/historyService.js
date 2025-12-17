// src/services/historyService.js

export async function fetchHistoricalPrices(ticker, range = "6mo") {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=1d`;

  const res = await fetch(url);
  const data = await res.json();

  const timestamps = data.chart.result[0].timestamp;
  const closes = data.chart.result[0].indicators.quote[0].close;

  const mapped = timestamps.map((ts, i) => ({
    date: new Date(ts * 1000),
    close: closes[i],
  }));

  return mapped.filter(x => x.close !== null);
}
