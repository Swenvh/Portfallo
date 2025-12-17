/*
  # Recreate Daily Price Update Trigger

  Drops and recreates the trigger function with correct URL.
*/

DROP FUNCTION IF EXISTS trigger_daily_price_update();

CREATE OR REPLACE FUNCTION trigger_daily_price_update()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id bigint;
BEGIN
  SELECT net.http_post(
    url := 'https://ricmsojmbjmgulldufxv.supabase.co/functions/v1/daily-price-update',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ) INTO request_id;
  
  RAISE NOTICE 'Daily price update triggered: %', request_id;
  
  RETURN jsonb_build_object('success', true, 'request_id', request_id);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
