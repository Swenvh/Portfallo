import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface StockPrice {
  symbol: string;
  price: number;
  currency: string;
  change_percent: number;
  price_date: string;
}

async function fetchYahooFinance(symbols: string[]): Promise<Map<string, StockPrice>> {
  const symbolsStr = symbols.join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsStr}`;
  
  console.log(`Fetching from Yahoo: ${url}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data.quoteResponse || !data.quoteResponse.result) {
      throw new Error('Invalid response structure');
    }
    
    const result = new Map<string, StockPrice>();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const priceDate = yesterday.toISOString().split('T')[0];
    
    data.quoteResponse.result.forEach((item: any) => {
      if (item && item.symbol && typeof item.regularMarketPrice === 'number') {
        result.set(item.symbol, {
          symbol: item.symbol,
          price: item.regularMarketPrice,
          currency: item.currency || 'USD',
          change_percent: item.regularMarketChangePercent || 0,
          price_date: priceDate,
        });
      }
    });
    
    console.log(`Fetched ${result.size} prices from Yahoo`);
    return result;
    
  } catch (error) {
    console.error('Yahoo Finance error:', error);
    return new Map();
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Starting daily price update...');
    
    // Get all unique symbols from the stock_prices table
    const { data: existingSymbols, error: fetchError } = await supabase
      .from('stock_prices')
      .select('symbol')
      .order('symbol');
    
    if (fetchError) {
      console.error('Failed to fetch symbols:', fetchError);
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Get unique symbols
    const uniqueSymbols = [...new Set(existingSymbols?.map(s => s.symbol) || [])];
    
    if (uniqueSymbols.length === 0) {
      console.log('No symbols to update');
      return new Response(
        JSON.stringify({ success: true, message: 'No symbols to update', count: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log(`Updating ${uniqueSymbols.length} symbols:`, uniqueSymbols);
    
    // Fetch prices in batches of 50 (Yahoo Finance limit)
    const batchSize = 50;
    const allPrices: StockPrice[] = [];
    
    for (let i = 0; i < uniqueSymbols.length; i += batchSize) {
      const batch = uniqueSymbols.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(uniqueSymbols.length / batchSize)}`);
      
      const prices = await fetchYahooFinance(batch);
      allPrices.push(...Array.from(prices.values()));
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < uniqueSymbols.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (allPrices.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch any prices from Yahoo Finance' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log(`Fetched ${allPrices.length} prices, saving to database...`);
    
    // Upsert all prices
    const { data, error } = await supabase
      .from('stock_prices')
      .upsert(allPrices, {
        onConflict: 'symbol,price_date',
        ignoreDuplicates: false,
      })
      .select();
    
    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log(`Daily update complete: ${data?.length || 0} prices saved`);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Daily price update completed',
        symbols_processed: uniqueSymbols.length,
        prices_saved: data?.length || 0,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
