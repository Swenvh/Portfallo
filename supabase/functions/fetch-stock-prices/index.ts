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

  console.log(`Fetching from Yahoo Finance for ${symbols.length} symbols`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Yahoo Finance HTTP error: ${res.status}`);
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!data.quoteResponse || !data.quoteResponse.result) {
      console.error('Invalid Yahoo Finance response structure');
      throw new Error('Invalid response structure');
    }

    const result = new Map<string, StockPrice>();
    const today = new Date();
    const priceDate = today.toISOString().split('T')[0];

    data.quoteResponse.result.forEach((item: any) => {
      if (item && item.symbol) {
        const price = item.regularMarketPrice || item.preMarketPrice || item.postMarketPrice;

        if (typeof price === 'number' && price > 0) {
          const currency = item.currency || (item.symbol.includes('.AS') || item.symbol.includes('.PA') || item.symbol.includes('.DE') ? 'EUR' : 'USD');

          result.set(item.symbol, {
            symbol: item.symbol,
            price: price,
            currency: currency,
            change_percent: item.regularMarketChangePercent || 0,
            price_date: priceDate,
          });

          console.log(`✓ ${item.symbol}: ${price} ${currency}`);
        } else {
          console.warn(`✗ ${item.symbol}: No valid price found`);
        }
      }
    });

    console.log(`Successfully fetched ${result.size}/${symbols.length} prices`);
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
    
    const { symbols } = await req.json();
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'symbols array is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log(`Processing ${symbols.length} symbols:`, symbols);
    
    const prices = await fetchYahooFinance(symbols);
    
    if (prices.size === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch prices from Yahoo Finance' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const priceArray = Array.from(prices.values());
    
    const { data, error } = await supabase
      .from('stock_prices')
      .upsert(priceArray, {
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
    
    console.log(`Saved ${data?.length || 0} prices to database`);
    
    return new Response(
      JSON.stringify({
        success: true,
        count: data?.length || 0,
        prices: priceArray,
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