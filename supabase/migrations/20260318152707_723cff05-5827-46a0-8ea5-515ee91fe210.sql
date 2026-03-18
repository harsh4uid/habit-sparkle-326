
-- Add start_date and hard_mode to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS start_date date NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hard_mode boolean NOT NULL DEFAULT false;

-- Future messages table
CREATE TABLE public.future_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  message text NOT NULL,
  trigger_after date NOT NULL,
  shown boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.future_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own future messages" ON public.future_messages FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Life stats table
CREATE TABLE public.life_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  discipline integer NOT NULL DEFAULT 50,
  focus integer NOT NULL DEFAULT 50,
  knowledge integer NOT NULL DEFAULT 50,
  health integer NOT NULL DEFAULT 50,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.life_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own life stats" ON public.life_stats FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Dopamine logs table
CREATE TABLE public.dopamine_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity text NOT NULL,
  type text NOT NULL DEFAULT 'productive',
  duration_minutes integer NOT NULL DEFAULT 0,
  logged_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.dopamine_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own dopamine logs" ON public.dopamine_logs FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Proof of work table
CREATE TABLE public.proof_of_work (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  note text NOT NULL DEFAULT '',
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.proof_of_work ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own proof of work" ON public.proof_of_work FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Daily challenges table
CREATE TABLE public.daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  challenge_text text NOT NULL,
  xp_reward integer NOT NULL DEFAULT 25,
  completed boolean NOT NULL DEFAULT false,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own daily challenges" ON public.daily_challenges FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for proof images
INSERT INTO storage.buckets (id, name, public) VALUES ('proof-images', 'proof-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for proof-images bucket
CREATE POLICY "Users can upload proof images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'proof-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view proof images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'proof-images');
CREATE POLICY "Users can delete own proof images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'proof-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Update handle_new_user to set start_date and create life_stats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, start_date)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), CURRENT_DATE);
  INSERT INTO public.life_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;
