-- Add governor profile fields to teams table
ALTER TABLE public.teams
ADD COLUMN IF NOT EXISTS shield_bio TEXT,
ADD COLUMN IF NOT EXISTS governor_response TEXT,
ADD COLUMN IF NOT EXISTS highest_high TEXT,
ADD COLUMN IF NOT EXISTS lowest_low TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Create storage bucket for governor profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('governor-images', 'governor-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to governor images
CREATE POLICY "Public can view governor images"
ON storage.objects FOR SELECT
USING (bucket_id = 'governor-images');

-- Allow authenticated users to upload governor images
CREATE POLICY "Authenticated users can upload governor images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'governor-images');

-- Allow authenticated users to update governor images
CREATE POLICY "Authenticated users can update governor images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'governor-images');

-- Allow authenticated users to delete governor images
CREATE POLICY "Authenticated users can delete governor images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'governor-images');