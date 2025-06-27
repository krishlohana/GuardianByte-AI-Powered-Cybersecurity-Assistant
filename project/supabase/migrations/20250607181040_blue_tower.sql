/*
  # Fix Tavus Videos RLS Policy

  1. Security Updates
    - Drop existing INSERT policy for anonymous users
    - Create new INSERT policy that properly allows anonymous users to create video records
    - Ensure the policy allows the specific insert operation being performed

  2. Changes
    - Updated INSERT policy for anon role to properly allow video record creation
    - Policy now explicitly allows the insert operation with proper conditions
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Anonymous users can create video records" ON tavus_videos;

-- Create a new INSERT policy that allows anonymous users to insert records
CREATE POLICY "Anonymous users can create video records"
  ON tavus_videos
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure the existing policies are still in place
DO $$
BEGIN
  -- Check if service role policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tavus_videos' 
    AND policyname = 'Service role can manage videos'
  ) THEN
    CREATE POLICY "Service role can manage videos"
      ON tavus_videos
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Check if authenticated users can view policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tavus_videos' 
    AND policyname = 'Users can view all videos'
  ) THEN
    CREATE POLICY "Users can view all videos"
      ON tavus_videos
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;