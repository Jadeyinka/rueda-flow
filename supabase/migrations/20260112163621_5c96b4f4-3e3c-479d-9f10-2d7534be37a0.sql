-- Create storage bucket for audio tracks
INSERT INTO storage.buckets (id, name, public)
VALUES ('tracks', 'tracks', true);

-- Allow public read access to tracks
CREATE POLICY "Public can read tracks"
ON storage.objects FOR SELECT
USING (bucket_id = 'tracks');

-- Allow authenticated users to upload tracks (for admin purposes)
CREATE POLICY "Authenticated users can upload tracks"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tracks' AND auth.role() = 'authenticated');