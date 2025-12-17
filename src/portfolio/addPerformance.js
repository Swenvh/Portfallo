/**
 * Verrijkt OPEN posities met performance
 * - gebruikt marketPrice
 * - fallback: laatste koopprijs
 */
export function addPerformance(positions = []) {
  return positions.map(p => {
    if (p.status !== "OPEN") return p;

    const quantity = Number(p.quantity || 0);

    const marketPrice = Number(p.marketPrice);
    const hasValidMarketPrice = marketPrice && marketPrice > 0;

    const price = hasValidMarketPrice ? marketPrice : Number(p.avgBuyPrice || 0);

    console.log(`[addPerformance] ${p.symbol}: marketPrice=${p.marketPrice}, hasValid=${hasValidMarketPrice}, using price=${price}`);

    const avgBuy = Number(p.avgBuyPrice || 0);

    const marketValue = quantity * price;
    const costBasis = quantity * avgBuy;
    const profitLoss = marketValue - costBasis;
    const profitLossPct = costBasis !== 0 ? (profitLoss / costBasis) * 100 : 0;

    return {
      ...p,
      price,
      marketValue,
      costBasis,
      profitLoss,
      profitLossPct
    };
  });
}
