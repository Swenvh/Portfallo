import { fetchPrices } from "../services/priceService";

export async function getLivePrices(positions) {
  if (!positions || positions.length === 0) {
    return [];
  }

  const symbolMap = new Map();
  const tickersToFetch = [];

  for (const p of positions) {
    const symbol = p.symbol?.trim();

    if (symbol) {
      symbolMap.set(symbol, p);
      tickersToFetch.push(symbol);
    }
  }

  if (tickersToFetch.length === 0) {
    console.warn("No symbols found, using fallback prices");
    return positions.map(p => ({
      ...p,
      marketPrice: p.avgBuyPrice || 0
    }));
  }

  try {
    const priceData = await fetchPrices(tickersToFetch);

    return positions.map(p => {
      const symbol = p.symbol?.trim();

      if (!symbol || !priceData[symbol]) {
        return {
          ...p,
          marketPrice: p.avgBuyPrice || 0
        };
      }

      const liveData = priceData[symbol];
      const livePrice = liveData.price;

      if (typeof livePrice !== 'number' || livePrice <= 0) {
        return {
          ...p,
          marketPrice: p.avgBuyPrice || 0
        };
      }

      return {
        ...p,
        marketPrice: livePrice,
        priceChange: liveData.change || 0
      };
    });

  } catch (error) {
    console.error("Error fetching live prices:", error);

    return positions.map(p => ({
      ...p,
      marketPrice: p.avgBuyPrice || 0
    }));
  }
}
