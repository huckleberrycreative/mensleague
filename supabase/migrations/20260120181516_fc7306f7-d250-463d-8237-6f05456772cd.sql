
-- Add salary_2029 column to player_salaries
ALTER TABLE public.player_salaries ADD COLUMN salary_2029 text;

-- Update salary_2029 to match salary_2028 values
UPDATE public.player_salaries SET salary_2029 = salary_2028;
