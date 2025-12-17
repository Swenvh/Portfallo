import { fetchPrices } from "../services/priceService";

export async function getLivePrices(positions) {
  if (!positions || positions.length === 0) {
    console.log("[LivePrices] No positions provided");
    return [];
  }

  console.log(`[LivePrices] Processing ${positions.length} positions`);

  const symbolMap = new Map();
  const tickersToFetch = [];

  for (const p of positions) {
    const symbol = p.symbol?.trim();
    console.log(`[LivePrices] Position: ${p.asset}, Symbol: ${symbol}, AvgBuy: ${p.avgBuyPrice}`);

    if (symbol) {
      symbolMap.set(symbol, p);
      tickersToFetch.push(symbol);
    }
  }

  console.log(`[LivePrices] Symbols to fetch: ${tickersToFetch.join(', ')}`);

  if (tickersToFetch.length === 0) {
    console.warn("[LivePrices] No symbols found, using fallback prices");
    return positions.map(p => ({
      ...p,
      marketPrice: p.avgBuyPrice || 0
    }));
  }

  try {
    console.log(`[LivePrices] Fetching prices for: ${tickersToFetch.join(', ')}`);
    const priceData = await fetchPrices(tickersToFetch);
    console.log("[LivePrices] Received price data:", priceData);

    return positions.map(p => {
      const symbol = p.symbol?.trim();

      if (!symbol || !priceData[symbol]) {
        console.log(`[LivePrices] No price data for ${symbol}, using fallback`);
        return {
          ...p,
          marketPrice: p.avgBuyPrice || 0
        };
      }

      const liveData = priceData[symbol];
      const livePrice = liveData.price;

      if (typeof livePrice !== 'number' || livePrice <= 0) {
        console.log(`[LivePrices] Invalid price for ${symbol}: ${livePrice}`);
        return {
          ...p,
          marketPrice: p.avgBuyPrice || 0
        };
      }

      const priceCurrency = liveData.currency || p.currency || 'EUR';

      console.log(`[LivePrices] ${symbol}: Live price ${livePrice} ${priceCurrency} (avg: ${p.avgBuyPrice} ${p.currency})`);

      return {
        ...p,
        marketPrice: livePrice,
        priceChange: liveData.change || 0,
        currency: priceCurrency
      };
    });

  } catch (error) {
    console.error("[LivePrices] Error fetching live prices:", error);

    return positions.map(p => ({
      ...p,
      marketPrice: p.avgBuyPrice || 0
    }));
  }
}
