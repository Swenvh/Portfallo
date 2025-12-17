/*
  # Enable Daily Automatic Price Updates

  1. Extensions
    - Enable pg_cron for scheduled jobs
    - Enable pg_net for HTTP requests to Edge Functions

  2. Functions
    - `trigger_daily_price_update()` - Makes HTTP request to daily-price-update Edge Function

  3. Cron Jobs
    - Daily job at 00:01 UTC to update all stock prices
    - Ensures all customer portfolios have fresh data every morning

  4. Notes
    - Uses service_role key to authenticate Edge Function calls
    - Runs automatically without manual intervention
    - Updates all symbols that exist in the database
    - Logs can be monitored via Supabase dashboard
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to trigger daily price update
CREATE OR REPLACE FUNCTION trigger_daily_price_update()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supabase_url text;
  service_role_key text;
  function_url text;
  request_id bigint;
BEGIN
  -- Get environment variables
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- Construct Edge Function URL
  function_url := supabase_url || '/functions/v1/daily-price-update';
  
  -- Make async HTTP request to Edge Function
  SELECT net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := '{}'::jsonb
  ) INTO request_id;
  
  RAISE NOTICE 'Daily price update triggered with request_id: %', request_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to trigger daily price update: %', SQLERRM;
END;
$$;

-- Schedule daily price update at 00:01 UTC every day
SELECT cron.schedule(
  'daily-stock-price-update',
  '1 0 * * *',  -- Every day at 00:01 UTC
  $$SELECT trigger_daily_price_update();$$
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;
