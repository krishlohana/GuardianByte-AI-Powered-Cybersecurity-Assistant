/*
  # Email Subscriptions Schema

  1. New Tables
    - `email_subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `verified` (boolean)
      - `verification_token` (text)
      - `preferences` (jsonb)

  2. Security
    - Enable RLS on `email_subscriptions` table
    - Add policies for authenticated users to manage their subscriptions
*/

CREATE TABLE IF NOT EXISTS email_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  verification_token text,
  preferences jsonb DEFAULT '{"scam_alerts": true, "security_tips": true, "weekly_digest": true}'::jsonb
);

ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subscriptions"
  ON email_subscriptions
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Anyone can subscribe"
  ON email_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);