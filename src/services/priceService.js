import { getMockPrice } from "./mockPrices";

async function fetchFromYahoo(tickers) {
  const symbols = tickers.join(",");
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

  console.log(`[PriceService] Trying Yahoo Finance: ${url}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!data.quoteResponse || !data.quoteResponse.result) {
      throw new Error("Invalid response structure");
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

    console.log(`[PriceService] Yahoo returned ${Object.keys(result).length} prices`);
    return result;

  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[PriceService] Yahoo Finance failed: ${error.message}`);
    return null;
  }
}

export async function fetchPrices(tickers) {
  if (!tickers || tickers.length === 0) {
    console.log("[PriceService] No tickers provided");
    return {};
  }

  console.log(`[PriceService] Fetching prices for: ${tickers.join(', ')}`);

  let result = await fetchFromYahoo(tickers);

  if (!result || Object.keys(result).length === 0) {
    console.log("[PriceService] Yahoo failed, using mock prices");
    result = {};

    tickers.forEach(ticker => {
      const mockPrice = getMockPrice(ticker);
      if (mockPrice) {
        result[ticker] = mockPrice;
        console.log(`[PriceService] Mock price for ${ticker}: ${mockPrice.price} ${mockPrice.currency}`);
      } else {
        console.warn(`[PriceService] No mock price available for ${ticker}`);
      }
    });
  }

  console.log(`[PriceService] Final result: ${Object.keys(result).length} prices retrieved`);
  return result;
}
