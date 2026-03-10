
CREATE TABLE public.sensors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  sensor_name TEXT NOT NULL,
  sensor_code TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected',
  today_usage INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read sensors (demo mode without auth)
CREATE POLICY "Allow public read" ON public.sensors FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.sensors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.sensors FOR DELETE USING (true);
CREATE POLICY "Allow public update" ON public.sensors FOR UPDATE USING (true) WITH CHECK (true);
