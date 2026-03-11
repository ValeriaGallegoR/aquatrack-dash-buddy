
-- Profiles table (auto-created on signup via trigger)
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tanks table
CREATE TABLE public.tanks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tank_name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  capacity NUMERIC NOT NULL DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tanks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own tanks" ON public.tanks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Update sensors: add tank_id, update RLS to be user-scoped
ALTER TABLE public.sensors ADD COLUMN tank_id UUID REFERENCES public.tanks(id) ON DELETE SET NULL;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow public read" ON public.sensors;
DROP POLICY IF EXISTS "Allow public insert" ON public.sensors;
DROP POLICY IF EXISTS "Allow public delete" ON public.sensors;
DROP POLICY IF EXISTS "Allow public update" ON public.sensors;

-- New user-scoped policies
CREATE POLICY "Users can read own sensors" ON public.sensors FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sensors" ON public.sensors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sensors" ON public.sensors FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own sensors" ON public.sensors FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Sensor readings table
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_id UUID NOT NULL REFERENCES public.sensors(id) ON DELETE CASCADE,
  reading_value NUMERIC NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sensor readings" ON public.sensor_readings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.sensors WHERE sensors.id = sensor_readings.sensor_id AND sensors.user_id = auth.uid()));
CREATE POLICY "Users can insert own sensor readings" ON public.sensor_readings FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.sensors WHERE sensors.id = sensor_readings.sensor_id AND sensors.user_id = auth.uid()));

-- Alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own alerts" ON public.alerts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Tank logs table
CREATE TABLE public.tank_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tank_id UUID NOT NULL REFERENCES public.tanks(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tank_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tank logs" ON public.tank_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tanks WHERE tanks.id = tank_logs.tank_id AND tanks.user_id = auth.uid()));
CREATE POLICY "Users can insert own tank logs" ON public.tank_logs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.tanks WHERE tanks.id = tank_logs.tank_id AND tanks.user_id = auth.uid()));
