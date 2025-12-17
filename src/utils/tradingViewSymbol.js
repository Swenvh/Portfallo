export function toTradingViewSymbol(symbol) {
  if (!symbol) return 'N/A';

  let cleanSymbol = symbol.toUpperCase().trim();

  if (/^[A-Z]{2}\d{10}$/.test(cleanSymbol)) {
    return cleanSymbol.substring(0, 2) + '...' + cleanSymbol.slice(-4);
  }

  cleanSymbol = cleanSymbol
    .replace(/\s+(AS|DE|NA|PA|L|SW|US|MI|MC)$/i, '')
    .replace(/\.AS$|\.DE$|\.PA$|\.L$|\.SW$|\.US$|\.MI$|\.MC$/i, '')
    .trim();

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

  return symbolMap[cleanSymbol] || cleanSymbol;
}
