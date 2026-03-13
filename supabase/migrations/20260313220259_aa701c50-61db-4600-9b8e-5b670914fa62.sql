
-- Add is_active column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Allow admins to read ALL profiles (for user management)
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update ALL profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read ALL sensors (to inspect user sensors)
CREATE POLICY "Admins can read all sensors"
  ON public.sensors FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read ALL alerts
CREATE POLICY "Admins can read all alerts"
  ON public.alerts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
