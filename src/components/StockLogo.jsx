import { useState } from 'react';

export default function StockLogo({ symbol, size = 32 }) {
  const [error, setError] = useState(false);

  if (!symbol) {
    return <div className="stock-logo-fallback" style={{ width: size, height: size }}>?</div>;
  }

  const cleanSymbol = symbol.split('.')[0];

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

  const domain = domainMap[cleanSymbol] || `${cleanSymbol.toLowerCase()}.com`;
  const logoUrl = `https://logo.clearbit.com/${domain}`;

  if (error) {
    return (
      <div
        className="stock-logo-fallback"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.4
        }}
      >
        {cleanSymbol.substring(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={symbol}
      className="stock-logo"
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  );
}
