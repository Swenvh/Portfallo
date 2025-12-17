export function toTradingViewSymbol(symbol) {
  if (!symbol) return '';

  const upperSymbol = symbol.toUpperCase();

  const symbolMap = {
    'AAPL': 'NASDAQ:AAPL',
    'MSFT': 'NASDAQ:MSFT',
    'META': 'NASDAQ:META',
    'GOOG': 'NASDAQ:GOOG',
    'GOOGL': 'NASDAQ:GOOGL',
    'NVDA': 'NASDAQ:NVDA',
    'TSLA': 'NASDAQ:TSLA',
    'AMD': 'NASDAQ:AMD',
    'AMZN': 'NASDAQ:AMZN',
    'NFLX': 'NASDAQ:NFLX',

    'ASML': 'EURONEXT:ASML',
    'ADYEN': 'EURONEXT:ADYEN',
    'SHEL': 'LSE:SHEL',
    'RDSA': 'EURONEXT:RDSA',

    'SONY': 'TYO:6758',
    'TOYOTA': 'TYO:7203',

    'VWRL': 'LSE:VWRL',
    'VWCE': 'XETRA:VWCE',
    'IWDA': 'XETRA:IWDA',
    'EUNL': 'XETRA:EUNL',

    'BTC': 'BINANCE:BTCUSDT',
    'ETH': 'BINANCE:ETHUSDT',
    'SOL': 'BINANCE:SOLUSDT',

    'XAU': 'TVC:GOLD',
    'XAG': 'TVC:SILVER',
  };

  return symbolMap[upperSymbol] || upperSymbol;
}
