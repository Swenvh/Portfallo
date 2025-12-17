export async function fetchPrices(tickers) {
  if (!tickers || tickers.length === 0) return {};

  try {
    const symbols = tickers.join(",");
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.quoteResponse || !data.quoteResponse.result) {
      console.error("Invalid response from Yahoo Finance:", data);
      return {};
    }

    const result = {};

    data.quoteResponse.result.forEach(item => {
      if (item && item.symbol && typeof item.regularMarketPrice === 'number') {
        result[item.symbol] = {
          price: item.regularMarketPrice,
          currency: item.currency || 'USD',
          change: item.regularMarketChangePercent || 0
        };
      }
    });

    return result;

  } catch (error) {
    console.error("Error in fetchPrices:", error);
    return {};
  }
}
