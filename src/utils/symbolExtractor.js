const PRODUCT_TO_SYMBOL = {
  "PAYPAL HOLDINGS INC": "PYPL",
  "LVMH MOET HENNESSY LOUIS VUITTON": "MC.PA",
  "ALIBABA GROUP": "BABA",
  "ALFEN": "ALFEN.AS",
  "WALT DISNEY": "DIS",
  "NIKE INC": "NKE",
  "VOLKSWAGEN AG": "VOW3.DE",
  "BASF SE": "BAS.DE"
};

const ISIN_TO_SYMBOL = {
  "US70450Y1038": "PYPL",
  "FR0000121014": "MC.PA",
  "US01609W1027": "BABA",
  "NL0012866412": "ALFEN.AS",
  "US2546871060": "DIS",
  "US6541061031": "NKE",
  "DE0007664039": "VOW3.DE",
  "DE000BASF111": "BAS.DE",
  "US0378331005": "AAPL",
  "US5949181045": "MSFT",
  "US88160R1014": "TSLA",
  "US30303M1027": "META",
  "US02079K3059": "GOOGL",
  "US67066G1040": "NVDA",
  "US0231351067": "AMZN"
};

export function extractSymbol(isin, productName) {
  if (isin && ISIN_TO_SYMBOL[isin]) {
    return ISIN_TO_SYMBOL[isin];
  }

  if (productName) {
    const upperProduct = productName.toUpperCase().trim();

    for (const [key, symbol] of Object.entries(PRODUCT_TO_SYMBOL)) {
      if (upperProduct.includes(key)) {
        return symbol;
      }
    }

    const words = upperProduct.split(/\s+/);
    if (words.length >= 2) {
      const possibleTicker = words[words.length - 1];
      if (possibleTicker.length <= 5 && /^[A-Z]+$/.test(possibleTicker)) {
        return possibleTicker;
      }
    }
  }

  return null;
}
