/*
  # Fix RLS policies for tavus_videos table

  1. Security Updates
    - Drop existing policies that might be conflicting
    - Create new comprehensive policies for tavus_videos table
    - Allow anonymous users to insert video records
    - Allow service role to manage all operations
    - Allow authenticated users to view videos

  2. Changes
    - Recreate INSERT policy for anonymous users
    - Ensure SELECT policy works for all users
    - Maintain service role access for management operations
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Anonymous users can create video records" ON tavus_videos;
DROP POLICY IF EXISTS "Service role can manage videos" ON tavus_videos;
DROP POLICY IF EXISTS "Users can view all videos" ON tavus_videos;

-- Create comprehensive policies for tavus_videos table
CREATE POLICY "Allow anonymous insert"
  ON tavus_videos
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select"
  ON tavus_videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous select"
  ON tavus_videos
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Service role full access"
  ON tavus_videos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE tavus_videos ENABLE ROW LEVEL SECURITY;