export async function fetchPrices(tickers) {
  if (!tickers || tickers.length === 0) return {};

  try {
    const symbols = tickers.join(",");
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

    console.log(`[PriceService] Fetching from Yahoo Finance: ${url}`);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    console.log(`[PriceService] Response status: ${res.status}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(`[PriceService] Raw response:`, data);

    if (!data.quoteResponse || !data.quoteResponse.result) {
      console.error("[PriceService] Invalid response from Yahoo Finance:", data);
      return {};
    }

    const result = {};

    data.quoteResponse.result.forEach(item => {
      console.log(`[PriceService] Processing item:`, item);
      if (item && item.symbol && typeof item.regularMarketPrice === 'number') {
        result[item.symbol] = {
          price: item.regularMarketPrice,
          currency: item.currency || 'USD',
          change: item.regularMarketChangePercent || 0
        };
        console.log(`[PriceService] Added ${item.symbol}: $${item.regularMarketPrice}`);
      }
    });

    console.log(`[PriceService] Final result:`, result);
    return result;

  } catch (error) {
    console.error("[PriceService] Error in fetchPrices:", error);
    return {};
  }
}
