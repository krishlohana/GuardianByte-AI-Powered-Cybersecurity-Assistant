/*
  # Create Tavus Videos Table

  1. New Tables
    - `tavus_videos`
      - `id` (uuid, primary key)
      - `video_id` (text, unique)
      - `download_url` (text)
      - `status` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on `tavus_videos` table
    - Add policies for authenticated users to access their videos
*/

CREATE TABLE IF NOT EXISTS tavus_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id text UNIQUE NOT NULL,
  download_url text,
  status text DEFAULT 'processing',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE tavus_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all videos"
  ON tavus_videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage videos"
  ON tavus_videos
  FOR ALL
  TO service_role
  USING (true);