export const demoPortfolioData = {
  positions: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 25,
      avgPrice: 145.50,
      currentPrice: 178.25,
      totalCost: 3637.50,
      currentValue: 4456.25,
      gain: 818.75,
      gainPercent: 22.51,
      weight: 28.5
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 15,
      avgPrice: 285.00,
      currentPrice: 378.50,
      totalCost: 4275.00,
      currentValue: 5677.50,
      gain: 1402.50,
      gainPercent: 32.81,
      weight: 36.3
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      shares: 20,
      avgPrice: 95.75,
      currentPrice: 140.25,
      totalCost: 1915.00,
      currentValue: 2805.00,
      gain: 890.00,
      gainPercent: 46.48,
      weight: 17.9
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      shares: 8,
      avgPrice: 210.00,
      currentPrice: 245.80,
      totalCost: 1680.00,
      currentValue: 1966.40,
      gain: 286.40,
      gainPercent: 17.05,
      weight: 12.6
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      shares: 5,
      avgPrice: 450.00,
      currentPrice: 495.30,
      totalCost: 2250.00,
      currentValue: 2476.50,
      gain: 226.50,
      gainPercent: 10.07,
      weight: 15.8
    }
  ],

  closedPositions: [
    {
      symbol: 'META',
      name: 'Meta Platforms',
      shares: 10,
      buyPrice: 180.00,
      sellPrice: 325.00,
      buyDate: '2023-03-15',
      sellDate: '2024-08-20',
      gain: 1450.00,
      gainPercent: 80.56
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      shares: 12,
      buyPrice: 95.50,
      sellPrice: 145.20,
      buyDate: '2023-05-10',
      sellDate: '2024-06-15',
      gain: 596.40,
      gainPercent: 52.04
    },
    {
      symbol: 'NFLX',
      name: 'Netflix Inc.',
      shares: 5,
      buyPrice: 320.00,
      sellPrice: 485.00,
      buyDate: '2023-07-01',
      sellDate: '2024-09-10',
      gain: 825.00,
      gainPercent: 51.56
    }
  ],

  performanceData: [
    { date: '2024-01', value: 12500 },
    { date: '2024-02', value: 13200 },
    { date: '2024-03', value: 12800 },
    { date: '2024-04', value: 13800 },
    { date: '2024-05', value: 14200 },
    { date: '2024-06', value: 14800 },
    { date: '2024-07', value: 15100 },
    { date: '2024-08', value: 14600 },
    { date: '2024-09', value: 15400 },
    { date: '2024-10', value: 16200 },
    { date: '2024-11', value: 16800 },
    { date: '2024-12', value: 17381.65 }
  ],

  summary: {
    totalValue: 17381.65,
    totalCost: 13757.50,
    totalGain: 3624.15,
    totalGainPercent: 26.34,
    cashBalance: 245.00,
    dayChange: 312.45,
    dayChangePercent: 1.83
  }
};
