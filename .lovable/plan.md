# Home Tutors Website + Admin Panel

A colorful, animation-heavy public site for a home-tutoring business, plus a full admin panel where admins manage all content (branding, hero, services, teachers, Why Us Q&A, contacts, background music, colors, languages, and other admins).

## Public site (visitors)

Sections, all animated on scroll (fade/slide/parallax) and with animated buttons that play a soft click sound:

1. **Sticky navbar** — logo + tuition name (admin-set), language switcher, theme/color switcher, nav links.
2. **Hero** — admin-set title + subtitle, animated gradient background, floating shapes, CTA buttons.
3. **Services** — cards with title, details, image or video (admin-uploaded).
4. **Why Us** — animated Q&A accordion (admin-managed; seeded with sensible defaults).
5. **Popular Teachers** — cards with photo, name, subject, experience, optional extras.
6. **Contact** — WhatsApp, Instagram, Facebook, and any custom platform links (admin-managed) + optional location.
7. **Footer** — brand, quick links, socials.
8. **Background music** — admin-uploaded track with a floating mute/unmute button (autoplay muted by default per browser rules).

Global:

- 5–6 preset color themes the visitor and admin can switch between (Sunset, Ocean, Forest, Candy, Midnight, Royal).
- Multi-language (English, Urdu, Hindi, Arabic, Spanish, French) with RTL for Urdu/Arabic.
- Framer Motion for scroll/parallax/entrance animations everywhere.
- Button click sound via Web Audio (small embedded tone, no asset needed) with a global mute toggle.

## Admin panel (`/admin`)

Login via Lovable Cloud auth (email/password + Google). Access gated by a `user_roles` table with a `has_role()` security-definer function.

Main admin: **[abdullahsaeed9109@gmail.com](mailto:abdullahsaeedp1@gmail.com)**— auto-granted `main_admin` on signup via trigger. Only the main admin can transfer main-admin ownership and can do everything a regular admin can.

Admins can:

- **Branding**: tuition name, logo upload, active color theme, default language.
- **Hero**: title, subtitle, optional background image.
- **Services**: CRUD (title, details, image or video upload).
- **Why Us Q&A**: CRUD (question, answer, order). Seeded with 6 default Q&As.
- **Popular Teachers**: CRUD (photo, name, subject, experience, optional bio/qualification).
- **Contact info**: CRUD list of `{platform, label, url/number, icon}` so any platform can be added.
- **Location** (optional): address + optional map embed URL.
- **Background music**: upload audio file, toggle enabled.
- **Admins**: add another admin by email (creates pending invite; role granted on signup or immediately if user exists); remove admin; **main admin only**: transfer ownership.

All uploads go to Lovable Cloud Storage (public bucket for site media).

## Technical section

**Stack**: TanStack Start (already set up) + Lovable Cloud (Supabase) + Tailwind v4 + shadcn + Framer Motion + i18next.

**Routes**:

- `/` — public site (single scrolling page composed of sections).
- `/auth` — sign in / sign up.
- `/admin` (under `_authenticated/`) — dashboard with tabs for each content area.

**Database (migrations)**:

- `app_role` enum: `main_admin`, `admin`.
- `user_roles(user_id, role)` + `has_role()` + `is_admin()` security-definer functions. Grants + RLS.
- `admin_invites(email, role)` — checked on signup trigger to auto-grant role.
- `site_settings` — singleton row: tuition_name, logo_url, hero_title, hero_subtitle, hero_bg_url, theme, default_language, location_text, map_url, music_url, music_enabled.
- `services(id, title, detail, media_url, media_type, sort)`.
- `faqs(id, question, answer, sort)`.
- `teachers(id, name, subject, experience, photo_url, bio, sort)`.
- `contacts(id, platform, label, url, icon, sort)`.
- Public SELECT policies (`TO anon, authenticated`) on all content tables. Write policies restricted to admins via `is_admin(auth.uid())`. `user_roles` write policies: admins can insert/delete `admin` rows; only main_admin can insert/delete `main_admin` rows.
- Trigger `on_auth_user_created`: if email = main admin email, grant `main_admin`; else if email in `admin_invites`, grant `admin`.
- Seed: default site_settings row, 6 FAQs, sample services/teachers/contacts so the site looks alive immediately.

**Storage**: one public bucket `site-media` for images/videos/audio/logo.

**Server functions**: use `requireSupabaseAuth` + role check for all admin writes. Public reads use the browser client (RLS allows anon SELECT).

**Client-side**:

- `i18next` + `react-i18next` with JSON dictionaries per language; `dir="rtl"` toggled for ar/ur.
- Theme system: CSS variables on `<html data-theme="...">`; presets defined in `styles.css`.
- Framer Motion `motion` wrappers + `useScroll`/`useTransform` for parallax; `whileHover`/`whileTap` for buttons.
- Click sound: small `AudioContext` beep helper, respects a global mute stored in `localStorage`.
- Background music: `<audio loop>` with floating control; starts muted, user can unmute.

**Scope note**: This is a large build. I'll ship it in one pass with sensible defaults everywhere so the site is fully usable immediately; refinements (extra languages, more themes, richer analytics) can follow. if thier is some error then dont do that step after last check and just tell me error in simple words and just make it simple

&nbsp;