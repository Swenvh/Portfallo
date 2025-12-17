/*
  # Stock Prices Storage System

  1. New Tables
    - `stock_prices`
      - `id` (uuid, primary key)
      - `symbol` (text) - Stock ticker symbol (e.g., AAPL, PYPL)
      - `price` (numeric) - Stock price
      - `currency` (text) - Currency code (USD, EUR)
      - `change_percent` (numeric) - Percentage change
      - `price_date` (date) - Date of the price
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Indexes
    - Unique index on (symbol, price_date) for fast lookups
    - Index on price_date for date-based queries

  3. Security
    - Enable RLS
    - Allow public read access (anyone can view prices)
    - Restrict write access to service role only

  4. Notes
    - Stores historical daily prices
    - One record per symbol per date
    - Prices are fetched from Yahoo Finance and cached
    - Updates automatically via Edge Function
*/

CREATE TABLE IF NOT EXISTS stock_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  change_percent numeric DEFAULT 0,
  price_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_stock_prices_symbol_date 
  ON stock_prices(symbol, price_date);

CREATE INDEX IF NOT EXISTS idx_stock_prices_date 
  ON stock_prices(price_date);

ALTER TABLE stock_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stock prices"
  ON stock_prices
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert stock prices"
  ON stock_prices
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update stock prices"
  ON stock_prices
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
