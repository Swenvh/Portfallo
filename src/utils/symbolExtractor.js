const PRODUCT_TO_SYMBOL = {
  "PAYPAL HOLDINGS INC": "PYPL",
  "PAYPAL": "PYPL",
  "LVMH MOET HENNESSY LOUIS VUITTON": "MC.PA",
  "LVMH": "MC.PA",
  "ALIBABA GROUP": "BABA",
  "ALIBABA": "BABA",
  "ALFEN": "ALFEN.AS",
  "WALT DISNEY": "DIS",
  "DISNEY": "DIS",
  "NIKE INC": "NKE",
  "NIKE": "NKE",
  "VOLKSWAGEN AG": "VOW3.DE",
  "VOLKSWAGEN": "VOW3.DE",
  "BASF SE": "BAS.DE",
  "BASF": "BAS.DE",
  "VANGUARD FTSE ALL": "VWRL.AS",
  "VWRL": "VWRL.AS",
  "ISHARES CORE MSCI WORLD": "IWDA.AS",
  "IWDA": "IWDA.AS",
  "MICROSOFT": "MSFT",
  "APPLE": "AAPL",
  "TESLA": "TSLA",
  "META PLATFORMS": "META",
  "FACEBOOK": "META",
  "ALPHABET": "GOOGL",
  "GOOGLE": "GOOGL",
  "NVIDIA": "NVDA",
  "AMAZON": "AMZN",
  "ASML": "ASML.AS",
  "SHELL": "SHEL.AS",
  "ROYAL DUTCH SHELL": "SHEL.AS",
  "ADYEN": "ADYEN.AS",
  "PROSUS": "PRX.AS",
  "HEINEKEN": "HEIA.AS",
  "ING GROEP": "INGA.AS",
  "ING GROUP": "INGA.AS",
  "KONINKLIJKE PHILIPS": "PHIA.AS",
  "PHILIPS": "PHIA.AS",
  "UNILEVER": "UNA.AS",
  "AKZO NOBEL": "AKZA.AS",
  "NN GROUP": "NN.AS",
  "RANDSTAD": "RAND.AS",
  "ABN AMRO": "ABN.AS",
  "ABN AMRO BANK": "ABN.AS",
  "AHOLD DELHAIZE": "AD.AS",
  "KONINKLIJKE AHOLD": "AD.AS",
  "DSM-FIRMENICH": "DSFIR.AS",
  "DSM": "DSFIR.AS",
  "KPN": "KPN.AS",
  "KONINKLIJKE KPN": "KPN.AS",
  "ARCADIS": "ARCAD.AS",
  "WOLTERS KLUWER": "WKL.AS",
  "VANGUARD S&P 500": "VUSA.AS",
  "ISHARES CORE S&P 500": "CSPX.AS",
  "ARGENX": "ARGX.BR",
  "GALAPAGOS": "GLPG.AS",
  "BASIC-FIT": "BFIT.AS",
  "JUST EAT TAKEAWAY": "TKWY.AS",
  "IMCD": "IMCD.AS",
  "CORBION": "CRBN.AS",
  "SIGNIFY": "LIGHT.AS",
  "FUGRO": "FUR.AS",
  "AALBERTS": "AALB.AS",
  "APERAM": "APAM.AS",
  "ASR NEDERLAND": "ASRNL.AS",
  "BE SEMICONDUCTOR": "BESI.AS",
  "FLOW TRADERS": "FLOW.AS",
  "OCI": "OCI.AS",
  "POSTnl": "PNL.AS",
  "SBM OFFSHORE": "SBMO.AS",
  "VOPAK": "VPK.AS"
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
  "US0231351067": "AMZN",
  "IE00B3RBWM25": "VWRL.AS",
  "IE00B4L5Y983": "IWDA.AS",
  "NL0010273215": "ASML.AS",
  "GB00BP6MXD84": "SHEL.AS",
  "NL0012969182": "ADYEN.AS",
  "NL0013654783": "PRX.AS",
  "NL0000009165": "HEIA.AS",
  "NL0011821202": "INGA.AS",
  "NL0000009538": "PHIA.AS",
  "NL0000388619": "UNA.AS",
  "NL0013267909": "AKZA.AS",
  "NL0011821208": "NN.AS",
  "NL0000379121": "RAND.AS",
  "NL0011540547": "ABN.AS",
  "NL0011794037": "AD.AS",
  "NL0000009827": "KPN.AS",
  "NL0006237562": "ARCAD.AS",
  "NL0000395903": "WKL.AS",
  "IE00B3XXRP09": "VUSA.AS",
  "IE00B5BMR087": "CSPX.AS",
  "BE0974464977": "ARGX.BR",
  "BE0003818359": "GLPG.AS",
  "NL0011872650": "BFIT.AS",
  "GB00BKX5CN86": "TKWY.AS",
  "NL0010801007": "IMCD.AS",
  "NL0000079000": "CRBN.AS",
  "NL0011821392": "LIGHT.AS",
  "NL0000352565": "FUR.AS",
  "NL0000852564": "AALB.AS",
  "LU0569974404": "APAM.AS",
  "NL0011872643": "ASRNL.AS",
  "NL0012866816": "BESI.AS",
  "NL0011279492": "FLOW.AS",
  "NL0010558797": "OCI.AS",
  "NL0009739416": "PNL.AS",
  "NL0000360618": "SBMO.AS",
  "NL0009432491": "VPK.AS"
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

    const tickerPatterns = [
      /\(([A-Z]{1,5}(?:\.[A-Z]{1,2})?)\)/,
      /\b([A-Z]{1,5}\.[A-Z]{1,2})\b/,
      /\s([A-Z]{2,5})$/
    ];

    for (const pattern of tickerPatterns) {
      const match = upperProduct.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    const words = upperProduct.split(/\s+/);
    if (words.length >= 2) {
      const possibleTicker = words[words.length - 1];
      if (possibleTicker.length >= 2 && possibleTicker.length <= 5 && /^[A-Z]+$/.test(possibleTicker)) {
        return possibleTicker;
      }
    }
  }

  if (isin) {
    const countryCode = isin.substring(0, 2);

    const exchangeSuffix = {
      'NL': '.AS',
      'BE': '.BR',
      'DE': '.DE',
      'FR': '.PA',
      'GB': '.L',
      'US': '',
      'CA': '.TO',
      'IE': '.AS'
    };

    if (exchangeSuffix[countryCode]) {
      return isin + exchangeSuffix[countryCode];
    }
  }

  return isin || null;
}
