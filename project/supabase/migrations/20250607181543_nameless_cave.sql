/*
  # Fix RLS policies for tavus_videos table

  1. Security Updates
    - Drop existing policies that may have incorrect conditions
    - Create new policies with proper permissions for anonymous users
    - Ensure INSERT operations work for the video bot functionality

  2. Changes
    - Allow anonymous users to insert video records
    - Allow anonymous users to select video records
    - Maintain service role access for administrative operations
*/

-- Drop existing policies to recreate them with correct conditions
DROP POLICY IF EXISTS "Allow anonymous insert" ON tavus_videos;
DROP POLICY IF EXISTS "Allow anonymous select" ON tavus_videos;
DROP POLICY IF EXISTS "Allow authenticated select" ON tavus_videos;
DROP POLICY IF EXISTS "Service role full access" ON tavus_videos;

-- Create new policies with proper conditions
CREATE POLICY "Allow anonymous insert"
  ON tavus_videos
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select"
  ON tavus_videos
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated select"
  ON tavus_videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert"
  ON tavus_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role full access"
  ON tavus_videos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);