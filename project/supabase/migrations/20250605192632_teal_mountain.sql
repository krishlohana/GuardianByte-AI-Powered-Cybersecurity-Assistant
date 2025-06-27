/*
  # Create storage bucket for email screenshots

  1. New Storage Bucket
    - Creates 'email-screenshots' bucket for storing email analysis screenshots
  
  2. Security
    - Enables public access for authenticated users to upload screenshots
    - Restricts read access to authenticated users only
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('email-screenshots', 'email-screenshots')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Allow authenticated users to upload screenshots"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'email-screenshots'
  AND owner = auth.uid()
);

CREATE POLICY "Allow authenticated users to read their own screenshots"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'email-screenshots'
  AND owner = auth.uid()
);