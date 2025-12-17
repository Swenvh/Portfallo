import { supabase } from "./supabaseClient";

export async function seedInitialPrices() {
  if (!supabase) {
    console.error('[SeedPrices] Supabase not available');
    return false;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const priceDate = yesterday.toISOString().split('T')[0];

  const initialPrices = [
    { symbol: 'PYPL', price: 61.25, currency: 'USD', change_percent: -13.35, price_date: priceDate },
    { symbol: 'MC.PA', price: 636.50, currency: 'EUR', change_percent: 1.66, price_date: priceDate },
    { symbol: 'BABA', price: 149.29, currency: 'USD', change_percent: -0.53, price_date: priceDate },
    { symbol: 'ALFEN.AS', price: 13.42, currency: 'EUR', change_percent: -8.50, price_date: priceDate },
    { symbol: 'DIS', price: 93.50, currency: 'USD', change_percent: 2.10, price_date: priceDate },
    { symbol: 'NKE', price: 66.96, currency: 'USD', change_percent: -1.20, price_date: priceDate },
    { symbol: 'VOW3.DE', price: 86.20, currency: 'EUR', change_percent: -3.40, price_date: priceDate },
    { symbol: 'BAS.DE', price: 44.91, currency: 'EUR', change_percent: -4.52, price_date: priceDate },
    { symbol: 'AAPL', price: 245.80, currency: 'USD', change_percent: 5.20, price_date: priceDate },
    { symbol: 'MSFT', price: 438.50, currency: 'USD', change_percent: 3.15, price_date: priceDate },
    { symbol: 'TSLA', price: 425.60, currency: 'USD', change_percent: 8.90, price_date: priceDate },
    { symbol: 'META', price: 618.40, currency: 'USD', change_percent: 4.50, price_date: priceDate },
    { symbol: 'GOOGL', price: 182.30, currency: 'USD', change_percent: 2.80, price_date: priceDate },
    { symbol: 'NVDA', price: 138.50, currency: 'USD', change_percent: 6.40, price_date: priceDate },
    { symbol: 'AMZN', price: 228.90, currency: 'USD', change_percent: 4.20, price_date: priceDate }
  ];

  console.log(`[SeedPrices] Seeding ${initialPrices.length} initial prices for ${priceDate}`);

  try {
    const { data, error } = await supabase
      .from('stock_prices')
      .upsert(initialPrices, {
        onConflict: 'symbol,price_date',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error('[SeedPrices] Error seeding prices:', error);
      return false;
    }

    console.log(`[SeedPrices] Successfully seeded ${data.length} prices`);
    return true;

  } catch (error) {
    console.error('[SeedPrices] Seed error:', error);
    return false;
  }
}
