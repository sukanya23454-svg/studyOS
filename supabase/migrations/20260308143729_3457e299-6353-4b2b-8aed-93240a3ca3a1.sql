
CREATE TABLE public.study_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  invite_code text NOT NULL UNIQUE DEFAULT substring(gen_random_uuid()::text from 1 for 8),
  host_id uuid NOT NULL,
  timer_duration integer NOT NULL DEFAULT 1500,
  timer_started_at timestamptz,
  timer_remaining integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view rooms" ON public.study_rooms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create rooms" ON public.study_rooms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update their room" ON public.study_rooms
  FOR UPDATE TO authenticated USING (auth.uid() = host_id);

CREATE POLICY "Host can delete their room" ON public.study_rooms
  FOR DELETE TO authenticated USING (auth.uid() = host_id);

CREATE TABLE public.room_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  display_name text NOT NULL DEFAULT 'Student',
  status text NOT NULL DEFAULT 'studying',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);

ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view room members" ON public.room_members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can join rooms" ON public.room_members
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own status" ON public.room_members
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON public.room_members
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.study_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_members;
