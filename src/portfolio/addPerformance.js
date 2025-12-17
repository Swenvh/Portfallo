/**
 * Verrijkt OPEN posities met performance
 * - gebruikt marketPrice
 * - fallback: laatste koopprijs
 */
export function addPerformance(positions = []) {
  return positions.map(p => {
    if (p.status !== "OPEN") return p;

    const quantity = Number(p.quantity || 0);

    const price =
      Number(p.marketPrice) ||
      Number(p.price) ||
      Number(p.avgBuyPrice) || // 🔥 ESSENTIËLE FALLBACK
      0;

    const avgBuy = Number(p.avgBuyPrice || 0);

    const marketValue = quantity * price;
    const costBasis = quantity * avgBuy;
    const profitLoss = marketValue - costBasis;

    return {
      ...p,
      price,
      marketValue,
      costBasis,
      profitLoss
    };
  });
}
