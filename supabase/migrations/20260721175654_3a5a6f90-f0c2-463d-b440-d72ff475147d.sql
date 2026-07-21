
-- Roles
CREATE TYPE public.app_role AS ENUM ('main_admin', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role) $$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role IN ('admin','main_admin')) $$;

CREATE POLICY "users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Invites for pre-registering admins by email
CREATE TABLE public.admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role public.app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_invites TO authenticated;
GRANT ALL ON public.admin_invites TO service_role;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read invites" ON public.admin_invites FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins insert invites" ON public.admin_invites FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admins delete invites" ON public.admin_invites FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- On new user: grant main_admin if canonical email, else grant admin if invited
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'abdullahsaeedp1@gmail.com' THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'main_admin') ON CONFLICT DO NOTHING;
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSIF EXISTS (SELECT 1 FROM public.admin_invites WHERE lower(email)=lower(NEW.email)) THEN
    INSERT INTO public.user_roles(user_id, role)
      SELECT NEW.id, role FROM public.admin_invites WHERE lower(email)=lower(NEW.email)
      ON CONFLICT DO NOTHING;
    DELETE FROM public.admin_invites WHERE lower(email)=lower(NEW.email);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Site settings (singleton)
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  tuition_name TEXT NOT NULL DEFAULT 'BrightMinds Home Tutors',
  logo_url TEXT,
  hero_title TEXT NOT NULL DEFAULT 'Learn From The Best Home Tutors',
  hero_subtitle TEXT NOT NULL DEFAULT 'Personalized one-on-one tutoring that helps students shine.',
  hero_bg_url TEXT,
  theme TEXT NOT NULL DEFAULT 'sunset',
  default_language TEXT NOT NULL DEFAULT 'en',
  location_text TEXT,
  map_url TEXT,
  music_url TEXT,
  music_enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admins insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
INSERT INTO public.site_settings(id) VALUES (1) ON CONFLICT DO NOTHING;

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  detail TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  sort INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write services" ON public.services FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- FAQs
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT ALL ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write faqs" ON public.faqs FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Teachers
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  experience TEXT,
  photo_url TEXT,
  bio TEXT,
  sort INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.teachers TO anon, authenticated;
GRANT ALL ON public.teachers TO authenticated;
GRANT ALL ON public.teachers TO service_role;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read teachers" ON public.teachers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write teachers" ON public.teachers FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Contacts
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  label TEXT,
  url TEXT NOT NULL,
  icon TEXT,
  sort INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contacts TO anon, authenticated;
GRANT ALL ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read contacts" ON public.contacts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write contacts" ON public.contacts FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Seed data
INSERT INTO public.faqs(question, answer, sort) VALUES
 ('Why choose our home tutors?', 'Our tutors are hand-picked, experienced, and passionate about helping students achieve their goals.', 1),
 ('Do you cover all subjects?', 'Yes — from Math and Science to Languages, Computer Science, and test prep.', 2),
 ('Are lessons one-on-one?', 'Yes, every session is personalized to the student''s pace and learning style.', 3),
 ('What are your fees?', 'Fees depend on grade level and subject. Contact us for a personalized quote.', 4),
 ('Can we schedule online sessions?', 'Absolutely. We offer flexible online and in-person sessions.', 5),
 ('How do I get started?', 'Just message us on WhatsApp or fill out the contact form and we''ll respond within a day.', 6);

INSERT INTO public.services(title, detail, sort) VALUES
 ('Math Tuition', 'From arithmetic to advanced calculus — build strong problem-solving skills.', 1),
 ('Science Tuition', 'Physics, Chemistry, Biology — concepts made simple and memorable.', 2),
 ('English & Languages', 'Grammar, literature, essay writing, and spoken English mastery.', 3),
 ('Computer Science', 'Coding, algorithms, and modern development for future-ready students.', 4);

INSERT INTO public.teachers(name, subject, experience, bio, sort) VALUES
 ('Ayesha Khan', 'Mathematics', '8 years', 'Loves making numbers click for every student.', 1),
 ('Ali Raza', 'Physics', '6 years', 'Turns complex physics into everyday intuition.', 2),
 ('Sara Ahmed', 'English', '10 years', 'Award-winning teacher of literature and writing.', 3);

INSERT INTO public.contacts(platform, label, url, icon, sort) VALUES
 ('whatsapp', 'WhatsApp', 'https://wa.me/1234567890', 'MessageCircle', 1),
 ('instagram', 'Instagram', 'https://instagram.com/', 'Instagram', 2),
 ('facebook', 'Facebook', 'https://facebook.com/', 'Facebook', 3);
