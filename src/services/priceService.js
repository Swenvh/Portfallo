import { supabase } from "./supabaseClient";
import { getMockPrice } from "./mockPrices";

async function getPricesFromDatabase(tickers) {
  if (!supabase) {
    console.warn('[PriceService] Supabase not configured');
    return {};
  }

  try {
    const today = new Date();
    const priceDate = today.toISOString().split('T')[0];

    console.log(`[PriceService] Checking database for ${tickers.length} tickers on ${priceDate}`);

    const { data, error } = await supabase
      .from('stock_prices')
      .select('symbol, price, currency, change_percent')
      .in('symbol', tickers)
      .eq('price_date', priceDate);

    if (error) {
      console.error('[PriceService] Database error:', error);
      return {};
    }

    const result = {};
    data.forEach(item => {
      result[item.symbol] = {
        price: Number(item.price),
        currency: item.currency,
        change: Number(item.change_percent)
      };
    });

    console.log(`[PriceService] Found ${Object.keys(result).length} prices in database for today`);
    return result;

  } catch (error) {
    console.error('[PriceService] Database fetch error:', error);
    return {};
  }
}

async function fetchAndStorePrices(tickers) {
  if (!supabase) {
    console.warn('[PriceService] Supabase not configured, skipping fetch');
    return {};
  }

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[PriceService] Missing Supabase credentials');
      return {};
    }

    const apiUrl = `${supabaseUrl}/functions/v1/fetch-stock-prices`;

    console.log(`[PriceService] Fetching ${tickers.length} new prices via Edge Function`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbols: tickers })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.prices) {
      throw new Error('Invalid response from Edge Function');
    }

    const result = {};
    data.prices.forEach(item => {
      result[item.symbol] = {
        price: Number(item.price),
        currency: item.currency,
        change: Number(item.change_percent)
      };
    });

    console.log(`[PriceService] Fetched and stored ${Object.keys(result).length} prices`);
    return result;

  } catch (error) {
    console.error('[PriceService] Edge Function error:', error);
    return {};
  }
}

export async function fetchPrices(tickers) {
  if (!tickers || tickers.length === 0) {
    console.log("[PriceService] No tickers provided");
    return {};
  }

  console.log(`[PriceService] Fetching prices for: ${tickers.join(', ')}`);

  let result = await getPricesFromDatabase(tickers);

  const missingTickers = tickers.filter(t => !result[t]);

  if (missingTickers.length > 0) {
    console.log(`[PriceService] Missing ${missingTickers.length} tickers, fetching from API`);
    const newPrices = await fetchAndStorePrices(missingTickers);
    result = { ...result, ...newPrices };
  }

  const stillMissing = tickers.filter(t => !result[t]);

  if (stillMissing.length > 0) {
    console.log(`[PriceService] Using mock prices for ${stillMissing.length} tickers`);
    stillMissing.forEach(ticker => {
      const mockPrice = getMockPrice(ticker);
      if (mockPrice) {
        result[ticker] = mockPrice;
        console.log(`[PriceService] Mock price for ${ticker}: ${mockPrice.price} ${mockPrice.currency}`);
      }
    });
  }

  console.log(`[PriceService] Final result: ${Object.keys(result).length} prices retrieved`);
  return result;
}
