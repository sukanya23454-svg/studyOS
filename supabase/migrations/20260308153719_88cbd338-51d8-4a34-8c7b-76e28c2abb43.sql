
CREATE TABLE public.room_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  display_name text NOT NULL DEFAULT 'Student',
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view room messages"
  ON public.room_messages FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can send messages"
  ON public.room_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;
