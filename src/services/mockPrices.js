export const MOCK_PRICES = {
  "PYPL": { price: 68.45, change: 4.35, currency: "EUR" },
  "MC.PA": { price: 648.20, change: 20.06, currency: "EUR" },
  "BABA": { price: 92.30, change: 17.09, currency: "EUR" },
  "ALFEN.AS": { price: 18.65, change: 38.29, currency: "EUR" },
  "DIS": { price: 110.82, change: 22.90, currency: "EUR" },
  "NKE": { price: 74.15, change: -15.54, currency: "EUR" },
  "VOW3.DE": { price: 98.44, change: -8.99, currency: "EUR" },
  "BAS.DE": { price: 44.23, change: -2.81, currency: "EUR" },
  "AAPL": { price: 235.50, change: 12.40, currency: "EUR" },
  "MSFT": { price: 398.20, change: 8.65, currency: "EUR" },
  "TSLA": { price: 360.80, change: -2.15, currency: "EUR" },
  "META": { price: 575.40, change: 15.30, currency: "EUR" },
  "GOOGL": { price: 167.50, change: 6.75, currency: "EUR" },
  "NVDA": { price: 133.60, change: 25.60, currency: "EUR" },
  "AMZN": { price: 210.90, change: 10.20, currency: "EUR" }
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
