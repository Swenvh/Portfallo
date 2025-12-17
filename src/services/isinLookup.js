const isinCache = new Map();

export async function lookupISIN(isin) {
  if (!isin || isin.length !== 12) {
    return null;
  }

  if (isinCache.has(isin)) {
    return isinCache.get(isin);
  }

  try {
    const response = await fetch(`https://api.openfigi.com/v3/mapping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        idType: 'ID_ISIN',
        idValue: isin,
        exchCode: 'US'
      }])
    });

    if (!response.ok) {
      console.warn(`[ISIN Lookup] Failed for ${isin}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data && data[0] && data[0].data && data[0].data.length > 0) {
      const result = data[0].data[0];
      const ticker = result.ticker;

      if (ticker) {
        const symbolData = {
          ticker: ticker,
          name: result.name || '',
          exchCode: result.exchCode || '',
          marketSector: result.marketSector || ''
        };

        isinCache.set(isin, symbolData);
        console.log(`[ISIN Lookup] Found ${isin} -> ${ticker}`);
        return symbolData;
      }
    }

    console.warn(`[ISIN Lookup] No data found for ${isin}`);
    return null;

  } catch (error) {
    console.error(`[ISIN Lookup] Error for ${isin}:`, error);
    return null;
  }
}

export async function lookupMultipleISINs(isins) {
  const results = {};

  for (const isin of isins) {
    const result = await lookupISIN(isin);
    if (result) {
      results[isin] = result.ticker;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}
