# Plan: Big feature upgrade

## 1. Database (migration)

- `teachers`: add optional columns `slug` (unique), `email`, `phone`, `whatsapp`, `instagram`, `facebook`, `linkedin`, `twitter`, `website`, `show_contact` (bool, default false).
- `services`: add optional `long_description`, `extra_images` (jsonb array of urls), `icon`.
- `site_settings`: add `contact_phone` (admin-only field surfaced as floating WhatsApp/tel button), `book_cta_label` default "Book a class".
- New table `teacher_invites` (email, teacher_id, token) so admins can invite a teacher to fill their own profile via a magic link route.
- Storage buckets: `site-media` (public) for logo/hero/service/teacher images, music, map images. Fallback: if public buckets blocked, keep URL text field visible next to the dropzone.

## 2. Public site changes

- **Services clickable**: Replace card with button that opens a Framer Motion modal. Animation variants: slide from bottom / left / right / top based on card index. Smooth spring, ~350ms. Shows title, long description, main image, extra image gallery, related info. Backdrop blur.
- **Teacher cards clickable**: Link to `/teachers/$slug` (new route). Detail page shows photo, name, subject, bio, experience, and only the contact links they filled in (if `show_contact` true). Route has proper `head()` metadata.
- **Floating contact button**: Bottom-right circular button using `contact_phone` — opens WhatsApp (`https://wa.me/...`) with pulse animation. Only rendered if admin set the phone.
- **CTA copy**: change "Book a free class" → configurable `book_cta_label` (default "Book a class").
- **PWA install**: Add `public/manifest.webmanifest` + head links, capture `beforeinstallprompt` event, show "Install app" button in navbar/footer when available (iOS shows instructional tooltip).
- **Auth page back button**: Animated arrow button top-left → returns to `/` with a fade+slide transition.
- **Navbar**: Remove admin panel link; instead show "Sign in" / "Sign up" buttons when logged out, and "Dashboard" (small avatar) only when the user is actually an admin.

## 3. Admin panel changes

- **Drag & drop uploader** component reused for: logo, hero background, service main image + extra images, service video, teacher photos, background music, map image. Uses `supabase.storage` upload to `site-media` bucket → returns public URL. Text URL input remains as fallback.
- **Admin list**: show emails of all `user_roles` rows (join via admin API through a server function using `requireSupabaseAuth` + `has_role` check, then `supabaseAdmin.auth.admin.listUsers`). Main admin & admins can see each other's emails.
- **Teacher invites**: "Invite teacher to edit" button → generates token, shows shareable link `/teacher/edit/$token`. That public route lets the teacher fill their own profile (bounded to that teacher_id).
- **Contact phone field** in Site tab (admin-only, drives floating button).

## 4. Files to add

- `supabase/migrations/<ts>_upgrade.sql`
- `src/components/site/ServiceModal.tsx`
- `src/components/site/InstallPWA.tsx`
- `src/components/site/FloatingContact.tsx`
- `src/components/admin/Dropzone.tsx`
- `src/routes/teachers.$slug.tsx`
- `src/routes/teacher.edit.$token.tsx`
- `public/manifest.webmanifest` + icons

## 5. Files to edit

- `src/components/site/Services.tsx` (clickable + modal)
- `src/components/site/Teachers.tsx` (link to detail page)
- `src/components/site/Navbar.tsx` (sign-in/up buttons, install button)
- `src/components/site/Hero.tsx` (CTA label)
- `src/routes/auth.tsx` (animated back button)
- `src/routes/admin.tsx` (dropzones, admin email list, invite flow, phone field)
- `src/routes/__root.tsx` (manifest link tags, FloatingContact mount)
- `src/lib/site-data.ts` (new queries)
- `src/integrations/supabase/types.ts` regenerates after migration

## Technical notes

- Storage bucket creation via `supabase--storage_create_bucket`. If blocked, dropzone still works by asking Supabase and falling back to base64 preview + URL manual entry.
- Server function `listAdmins` uses `requireSupabaseAuth`, verifies caller is admin via `has_role`, then dynamically imports `supabaseAdmin` to list users and join with `user_roles`.
- Teacher edit token stored server-side in `teacher_invites`; edit page validates token before allowing update (public route, no auth — uses server fn that checks token).
- Modal animation uses Framer Motion `AnimatePresence` with directional variants; keep transitions ~0.35s spring for smoothness.
- WhatsApp deep link: `https://wa.me/<digits>` — strip non-digits from stored phone.
- dont make any error plzz if thier is some error after last checkup just tell me and remove that part and i will correct it lateer but i ll hope that evry thing will be done in a perfect way
- &nbsp;