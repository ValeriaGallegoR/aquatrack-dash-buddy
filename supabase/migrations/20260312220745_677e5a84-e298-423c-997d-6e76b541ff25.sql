
-- Remove tank_id column from sensors first (drops FK constraint)
ALTER TABLE public.sensors DROP COLUMN IF EXISTS tank_id;

-- Drop tank_logs table
DROP TABLE IF EXISTS public.tank_logs;

-- Drop tanks table
DROP TABLE IF EXISTS public.tanks;
