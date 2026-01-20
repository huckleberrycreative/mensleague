-- Create coaches table
CREATE TABLE public.coaches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo_url TEXT,
  tenure_start INTEGER NOT NULL,
  tenure_end INTEGER,
  tenure_summary TEXT,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  playoff_wins INTEGER NOT NULL DEFAULT 0,
  playoff_losses INTEGER NOT NULL DEFAULT 0,
  championships INTEGER NOT NULL DEFAULT 0,
  is_current BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can read coaches" ON public.coaches FOR SELECT USING (true);
CREATE POLICY "Admins can insert coaches" ON public.coaches FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update coaches" ON public.coaches FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete coaches" ON public.coaches FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for team lookups
CREATE INDEX idx_coaches_team_id ON public.coaches(team_id);
CREATE INDEX idx_coaches_display_order ON public.coaches(display_order);

-- Create storage bucket for coach images
INSERT INTO storage.buckets (id, name, public) VALUES ('coach-images', 'coach-images', true);

-- Storage policies for coach images
CREATE POLICY "Coach images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'coach-images');
CREATE POLICY "Authenticated users can upload coach images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'coach-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update coach images" ON storage.objects FOR UPDATE USING (bucket_id = 'coach-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete coach images" ON storage.objects FOR DELETE USING (bucket_id = 'coach-images' AND auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_coaches_updated_at
  BEFORE UPDATE ON public.coaches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();