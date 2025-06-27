/*
  # Add anonymous insert policy for tavus_videos table

  1. Security Changes
    - Add policy to allow anonymous users to insert into tavus_videos table
    - This enables the TavusVideoBot component to store video generation records
    - Maintains existing policies for service_role and authenticated users

  2. Policy Details
    - Allows INSERT operations for anonymous (anon) role
    - Uses simple `true` condition to allow all anonymous inserts
    - Follows the pattern used in email_subscriptions table
*/

-- Add policy to allow anonymous users to insert video records
CREATE POLICY "Anonymous users can create video records"
  ON tavus_videos
  FOR INSERT
  TO anon
  WITH CHECK (true);