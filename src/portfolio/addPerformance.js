import { convertToEUR } from "../utils/currencyConverter";

/**
 * Verrijkt OPEN posities met performance
 * - gebruikt marketPrice
 * - fallback: laatste koopprijs
 * - converteert naar EUR voor totalen
 */
export function addPerformance(positions = []) {
  return positions.map(p => {
    if (p.status !== "OPEN") return p;

    const quantity = Number(p.quantity || 0);

    const marketPrice = Number(p.marketPrice);
    const hasValidMarketPrice = marketPrice && marketPrice > 0;

    const price = hasValidMarketPrice ? marketPrice : Number(p.avgBuyPrice || 0);
    const avgBuy = Number(p.avgBuyPrice || 0);
    const currency = p.currency || 'EUR';

    console.log(`[addPerformance] ${p.symbol}: price=${price} ${currency}, avgBuy=${avgBuy}`);

    const marketValue = quantity * price;
    const costBasis = quantity * avgBuy;
    const profitLoss = marketValue - costBasis;
    const profitLossPct = costBasis !== 0 ? (profitLoss / costBasis) * 100 : 0;

    const marketValueEUR = convertToEUR(marketValue, currency);
    const costBasisEUR = convertToEUR(costBasis, currency);
    const profitLossEUR = convertToEUR(profitLoss, currency);

    return {
      ...p,
      price,
      currency,
      marketValue,
      costBasis,
      profitLoss,
      profitLossPct,
      marketValueEUR,
      costBasisEUR,
      profitLossEUR
    };
  });
}
