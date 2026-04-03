
-- Create room_groups table
CREATE TABLE public.room_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.room_groups ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can read own room groups" ON public.room_groups
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own room groups" ON public.room_groups
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own room groups" ON public.room_groups
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own room groups" ON public.room_groups
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admins can read all
CREATE POLICY "Admins can read all room groups" ON public.room_groups
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add room_group_id column to sensors table
ALTER TABLE public.sensors ADD COLUMN room_group_id UUID REFERENCES public.room_groups(id) ON DELETE SET NULL;
