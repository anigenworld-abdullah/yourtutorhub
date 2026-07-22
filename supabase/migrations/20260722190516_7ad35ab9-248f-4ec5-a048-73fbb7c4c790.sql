
-- Teachers: profile + optional contact fields
ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS facebook text,
  ADD COLUMN IF NOT EXISTS linkedin text,
  ADD COLUMN IF NOT EXISTS twitter text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS show_contact boolean NOT NULL DEFAULT false;

-- Backfill slugs for existing teachers
UPDATE public.teachers
   SET slug = lower(regexp_replace(coalesce(name,'teacher') || '-' || substr(id::text,1,6), '[^a-z0-9]+', '-', 'g'))
 WHERE slug IS NULL;

-- Services: richer detail
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS extra_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS icon text;

-- Site settings: phone + CTA copy
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS book_cta_label text NOT NULL DEFAULT 'Book a class';

-- Public read for teacher_invites is required so a teacher can open their edit link
CREATE TABLE IF NOT EXISTS public.teacher_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.teacher_invites TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.teacher_invites TO authenticated;
GRANT ALL ON public.teacher_invites TO service_role;

ALTER TABLE public.teacher_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read invites by token"
  ON public.teacher_invites FOR SELECT
  USING (true);

CREATE POLICY "Admins manage invites"
  ON public.teacher_invites FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Allow the invited teacher to update their own row via the token flow.
-- We keep write to admins only through RLS; the public edit page will call
-- a security-definer function to apply the update after verifying the token.
CREATE OR REPLACE FUNCTION public.update_teacher_via_invite(
  _token text,
  _name text,
  _subject text,
  _bio text,
  _experience text,
  _photo_url text,
  _email text,
  _phone text,
  _whatsapp text,
  _instagram text,
  _facebook text,
  _linkedin text,
  _twitter text,
  _website text,
  _show_contact boolean
) RETURNS public.teachers
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _tid uuid;
  _row public.teachers;
BEGIN
  SELECT teacher_id INTO _tid FROM public.teacher_invites WHERE token = _token;
  IF _tid IS NULL THEN
    RAISE EXCEPTION 'Invalid token';
  END IF;
  UPDATE public.teachers SET
    name = coalesce(_name, name),
    subject = coalesce(_subject, subject),
    bio = _bio,
    experience = _experience,
    photo_url = _photo_url,
    email = _email,
    phone = _phone,
    whatsapp = _whatsapp,
    instagram = _instagram,
    facebook = _facebook,
    linkedin = _linkedin,
    twitter = _twitter,
    website = _website,
    show_contact = coalesce(_show_contact, show_contact)
  WHERE id = _tid
  RETURNING * INTO _row;
  RETURN _row;
END;
$$;

REVOKE ALL ON FUNCTION public.update_teacher_via_invite(text,text,text,text,text,text,text,text,text,text,text,text,text,text,boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_teacher_via_invite(text,text,text,text,text,text,text,text,text,text,text,text,text,text,boolean) TO anon, authenticated;
