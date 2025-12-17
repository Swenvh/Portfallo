const logoCache = new Map();

export function getStockLogo(symbol) {
  if (!symbol) return null;

  if (logoCache.has(symbol)) {
    return logoCache.get(symbol);
  }

  const cleanSymbol = symbol.split('.')[0];

  const logoUrl = `https://logo.clearbit.com/${getCompanyDomain(cleanSymbol)}`;

  logoCache.set(symbol, logoUrl);
  return logoUrl;
}

function getCompanyDomain(symbol) {
  const domainMap = {
    'AAPL': 'apple.com',
    'MSFT': 'microsoft.com',
    'GOOGL': 'google.com',
    'GOOG': 'google.com',
    'AMZN': 'amazon.com',
    'META': 'meta.com',
    'TSLA': 'tesla.com',
    'NVDA': 'nvidia.com',
    'PYPL': 'paypal.com',
    'NFLX': 'netflix.com',
    'BABA': 'alibaba.com',
    'DIS': 'disney.com',
    'NKE': 'nike.com',
    'ASML': 'asml.com',
    'ADYEN': 'adyen.com',
    'SHEL': 'shell.com',
    'INGA': 'ing.com',
    'ABN': 'abnamro.com',
    'PHIA': 'philips.com',
    'HEIA': 'heineken.com',
    'UNA': 'unilever.com',
    'AD': 'aholddelhaize.com',
    'KPN': 'kpn.com',
    'RAND': 'randstad.com',
    'NN': 'nn-group.com',
    'WKL': 'wolterskluwer.com',
    'AKZA': 'akzonobel.com',
    'ARCAD': 'arcadis.com',
    'PRX': 'prosus.com',
    'TKWY': 'justeattakeaway.com',
    'BFIT': 'basic-fit.com',
    'GLPG': 'glpg.com',
    'IMCD': 'imcdgroup.com',
    'FLOW': 'flowtraders.com',
    'ALFEN': 'alfen.com',
    'BESI': 'besi.com',
    'VOW3': 'volkswagenag.com',
    'BAS': 'basf.com',
    'MC': 'lvmh.com'
  };

  return domainMap[symbol] || `${symbol.toLowerCase()}.com`;
}

export function getStockLogoWithFallback(symbol) {
  const logo = getStockLogo(symbol);
  return {
    url: logo,
    fallback: getInitials(symbol)
  };
}

function getInitials(symbol) {
  if (!symbol) return '?';
  const clean = symbol.split('.')[0];
  return clean.substring(0, 2).toUpperCase();
}
