-- Allow authenticated users to claim unpaired sensors (user_id IS NULL)
CREATE POLICY "Users can pair unclaimed sensors"
ON public.sensors
FOR UPDATE
TO authenticated
USING (user_id IS NULL)
WITH CHECK (auth.uid() = user_id);