export const MOCK_PRICES = {
  "PYPL": { price: 61.25, change: -13.35, currency: "USD" },
  "MC.PA": { price: 636.50, change: 1.66, currency: "EUR" },
  "BABA": { price: 149.29, change: -0.53, currency: "USD" },
  "ALFEN.AS": { price: 13.42, change: -8.50, currency: "EUR" },
  "DIS": { price: 93.50, change: 2.10, currency: "USD" },
  "NKE": { price: 66.96, change: -1.20, currency: "USD" },
  "VOW3.DE": { price: 86.20, change: -3.40, currency: "EUR" },
  "BAS.DE": { price: 44.91, change: -4.52, currency: "EUR" },
  "AAPL": { price: 245.80, change: 5.20, currency: "USD" },
  "MSFT": { price: 438.50, change: 3.15, currency: "USD" },
  "TSLA": { price: 425.60, change: 8.90, currency: "USD" },
  "META": { price: 618.40, change: 4.50, currency: "USD" },
  "GOOGL": { price: 182.30, change: 2.80, currency: "USD" },
  "NVDA": { price: 138.50, change: 6.40, currency: "USD" },
  "AMZN": { price: 228.90, change: 4.20, currency: "USD" }
};

export function getMockPrice(symbol) {
  const mock = MOCK_PRICES[symbol];
  if (!mock) {
    return null;
  }

  const randomVariation = (Math.random() - 0.5) * 0.02;
  const price = mock.price * (1 + randomVariation);

  return {
    price: parseFloat(price.toFixed(2)),
    change: mock.change,
    currency: mock.currency
  };
}
