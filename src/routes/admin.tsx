import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LogOut, Home, Settings, Wrench, HelpCircle, Users, Phone, Music, ShieldPlus, Crown, Copy, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useSettings, useServices, useFaqs, useTeachers, useContacts } from "@/lib/site-data";
import { SoundButton } from "@/components/site/primitives";
import { THEMES } from "@/lib/site-context";
import { Dropzone } from "@/components/admin/Dropzone";
import { listAdmins, findUserIdByEmail } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Your Tutor Hub" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "brand" | "hero" | "services" | "faqs" | "teachers" | "contacts" | "music" | "admins";
const TABS: { id: Tab; label: string; Icon: any }[] = [
  { id: "brand", label: "Branding", Icon: Settings },
  { id: "hero", label: "Hero", Icon: Home },
  { id: "services", label: "Services", Icon: Wrench },
  { id: "faqs", label: "Why Us Q&A", Icon: HelpCircle },
  { id: "teachers", label: "Teachers", Icon: Users },
  { id: "contacts", label: "Contacts", Icon: Phone },
  { id: "music", label: "Music, Map & Phone", Icon: Music },
  { id: "admins", label: "Admins", Icon: ShieldPlus },
];

function AdminPage() {
  const { user, loading, isAdmin, isMainAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("brand");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center rounded-2xl border bg-card p-8">
          <h1 className="text-2xl font-bold">Not authorized</h1>
          <p className="text-muted-foreground mt-2">Signed in as {user.email}. Your account isn't an admin. Ask the main admin to add you.</p>
          <SoundButton className="mt-6" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}>
            <LogOut className="h-4 w-4" /> Sign out
          </SoundButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="font-extrabold text-brand-gradient text-lg">Admin</Link>
          <div className="flex items-center gap-2 text-sm">
            {isMainAdmin && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-brand-gradient text-white text-xs"><Crown className="h-3 w-3"/> Main admin</span>}
            <span className="text-muted-foreground hidden sm:inline">{user.email}</span>
            <SoundButton variant="outline" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}>
              <LogOut className="h-4 w-4" /> Sign out
            </SoundButton>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto grid md:grid-cols-[220px_1fr] gap-6 p-6">
        <aside className="rounded-2xl border bg-card p-3 h-fit sticky top-20">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left ${tab === t.id ? "btn-brand" : "hover:bg-secondary"}`}>
              <t.Icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </aside>
        <motion.section
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-6"
        >
          {tab === "brand" && <BrandingTab />}
          {tab === "hero" && <HeroTab />}
          {tab === "services" && <ServicesTab />}
          {tab === "faqs" && <FaqsTab />}
          {tab === "teachers" && <TeachersTab />}
          {tab === "contacts" && <ContactsTab />}
          {tab === "music" && <MusicTab />}
          {tab === "admins" && <AdminsTab isMainAdmin={isMainAdmin} currentUserId={user.id} />}
        </motion.section>
      </div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${props.className ?? ""}`} />;
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${props.className ?? ""}`} />;
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium block mb-1">{children}</label>;
}

/* BRANDING */
function BrandingTab() {
  const { data: s } = useSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (s) setForm(s); }, [s]);

  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      tuition_name: form.tuition_name, logo_url: form.logo_url, theme: form.theme, default_language: form.default_language,
      book_cta_label: form.book_cta_label,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Branding</h2>
      <div><Label>Tuition name</Label><Input value={form.tuition_name ?? ""} onChange={(e)=>setForm({...form, tuition_name: e.target.value})} /></div>
      <div><Label>Logo</Label><Dropzone value={form.logo_url} onChange={(url)=>setForm({...form, logo_url: url})} accept="image/*" folder="logo" /></div>
      <div><Label>Booking button label</Label><Input value={form.book_cta_label ?? ""} onChange={(e)=>setForm({...form, book_cta_label: e.target.value})} placeholder="Book a class" /></div>
      <div>
        <Label>Default color theme</Label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {THEMES.map((th) => (
            <button key={th.id} onClick={() => setForm({...form, theme: th.id})}
              className={`h-14 rounded-lg ring-2 ${form.theme===th.id ? "ring-primary" : "ring-transparent"}`}
              style={{ background: th.swatch }} title={th.label} />
          ))}
        </div>
      </div>
      <div>
        <Label>Default language</Label>
        <select value={form.default_language ?? "en"} onChange={(e)=>setForm({...form, default_language: e.target.value})}
          className="w-full rounded-lg border bg-background px-3 py-2">
          {["en","ur","hi","ar","es","fr"].map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <SoundButton onClick={save}>Save changes</SoundButton>
    </div>
  );
}

/* HERO */
function HeroTab() {
  const { data: s } = useSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (s) setForm(s); }, [s]);

  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      hero_title: form.hero_title, hero_subtitle: form.hero_subtitle, hero_bg_url: form.hero_bg_url,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  };
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Hero section</h2>
      <div><Label>Title</Label><Input value={form.hero_title ?? ""} onChange={(e)=>setForm({...form, hero_title: e.target.value})} /></div>
      <div><Label>Subtitle</Label><Textarea rows={3} value={form.hero_subtitle ?? ""} onChange={(e)=>setForm({...form, hero_subtitle: e.target.value})} /></div>
      <div><Label>Background image</Label><Dropzone value={form.hero_bg_url} onChange={(url)=>setForm({...form, hero_bg_url: url})} accept="image/*" folder="hero" /></div>
      <SoundButton onClick={save}>Save changes</SoundButton>
    </div>
  );
}

/* SERVICES */
function ServicesTab() {
  const { data } = useServices();
  const qc = useQueryClient();
  const blank = { title: "", detail: "", long_description: "", media_url: "", media_type: "image", extra_images: [], sort: 0 };
  const [editing, setEditing] = useState<any>(blank);
  const [isNew, setIsNew] = useState(true);

  const save = async () => {
    const payload: any = { ...editing, extra_images: editing.extra_images ?? [] };
    let res;
    if (isNew) { delete payload.id; res = await supabase.from("services").insert(payload); }
    else res = await supabase.from("services").update(payload).eq("id", editing.id);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["services"] });
    setEditing(blank); setIsNew(true);
  };
  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  const extras: string[] = Array.isArray(editing.extra_images) ? editing.extra_images : [];

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Services</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold">{isNew ? "Add new" : "Edit"}</h3>
          <div><Label>Title</Label><Input value={editing.title ?? ""} onChange={(e)=>setEditing({...editing, title: e.target.value})} /></div>
          <div><Label>Short detail</Label><Textarea rows={2} value={editing.detail ?? ""} onChange={(e)=>setEditing({...editing, detail: e.target.value})} /></div>
          <div><Label>Full description (shown in popup)</Label><Textarea rows={4} value={editing.long_description ?? ""} onChange={(e)=>setEditing({...editing, long_description: e.target.value})} /></div>
          <div><Label>Main media type</Label>
            <select value={editing.media_type ?? "image"} onChange={(e)=>setEditing({...editing, media_type: e.target.value})}
              className="w-full rounded-lg border bg-background px-3 py-2">
              <option value="image">Image</option><option value="video">Video</option>
            </select>
          </div>
          <div><Label>Main media</Label>
            <Dropzone value={editing.media_url} onChange={(url)=>setEditing({...editing, media_url: url})}
              accept={editing.media_type === "video" ? "video/*" : "image/*"}
              preview={editing.media_type === "video" ? "video" : "image"}
              folder={`services/${editing.media_type ?? "image"}`} />
          </div>
          <div>
            <Label>Extra images (related to this service)</Label>
            <div className="grid grid-cols-2 gap-2">
              {extras.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="rounded-lg aspect-square object-cover w-full" />
                  <button type="button" onClick={() => setEditing({ ...editing, extra_images: extras.filter((_,j)=>j!==i) })}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full h-6 w-6 text-xs">×</button>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Dropzone value="" onChange={(url)=> url && setEditing({ ...editing, extra_images: [...extras, url] })}
                accept="image/*" folder="services/extras" label="Drop an extra image here" />
            </div>
          </div>
          <div><Label>Sort order</Label><Input type="number" value={editing.sort ?? 0} onChange={(e)=>setEditing({...editing, sort: Number(e.target.value)})} /></div>
          <div className="flex gap-2">
            <SoundButton onClick={save}>{isNew ? "Add service" : "Save"}</SoundButton>
            {!isNew && <SoundButton variant="outline" onClick={() => { setEditing(blank); setIsNew(true); }}>Cancel</SoundButton>}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Existing</h3>
          {data?.map((row: any) => (
            <div key={row.id} className="rounded-lg border p-3 flex items-start justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold">{row.title}</div>
                <div className="text-muted-foreground line-clamp-2">{row.detail}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <SoundButton variant="outline" onClick={() => { setEditing(row); setIsNew(false); }}>Edit</SoundButton>
                <SoundButton variant="outline" onClick={() => del(row.id)}>Del</SoundButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* FAQS */
function FaqsTab() {
  const { data } = useFaqs();
  const qc = useQueryClient();
  const blank = { question: "", answer: "", sort: 0 };
  const [editing, setEditing] = useState<any>(blank);
  const [isNew, setIsNew] = useState(true);
  const save = async () => {
    const payload: any = { ...editing };
    let res;
    if (isNew) { delete payload.id; res = await supabase.from("faqs").insert(payload); }
    else res = await supabase.from("faqs").update(payload).eq("id", editing.id);
    if (res.error) return toast.error(res.error.message);
    qc.invalidateQueries({ queryKey: ["faqs"] });
    setEditing(blank); setIsNew(true);
  };
  const del = async (id: string) => { await supabase.from("faqs").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["faqs"] }); };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Why Us Q&A</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div><Label>Question</Label><Input value={editing.question ?? ""} onChange={(e)=>setEditing({...editing, question: e.target.value})} /></div>
          <div><Label>Answer</Label><Textarea rows={4} value={editing.answer ?? ""} onChange={(e)=>setEditing({...editing, answer: e.target.value})} /></div>
          <div><Label>Sort</Label><Input type="number" value={editing.sort ?? 0} onChange={(e)=>setEditing({...editing, sort: Number(e.target.value)})} /></div>
          <div className="flex gap-2">
            <SoundButton onClick={save}>{isNew ? "Add" : "Save"}</SoundButton>
            {!isNew && <SoundButton variant="outline" onClick={() => { setEditing(blank); setIsNew(true); }}>Cancel</SoundButton>}
          </div>
        </div>
        <div className="space-y-2">
          {data?.map((row: any) => (
            <div key={row.id} className="rounded-lg border p-3 flex items-start justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold">{row.question}</div>
                <div className="text-muted-foreground line-clamp-2">{row.answer}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <SoundButton variant="outline" onClick={() => { setEditing(row); setIsNew(false); }}>Edit</SoundButton>
                <SoundButton variant="outline" onClick={() => del(row.id)}>Del</SoundButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* TEACHERS */
function slugify(s: string) {
  return (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || `t-${Math.random().toString(36).slice(2,8)}`;
}
function TeachersTab() {
  const { data } = useTeachers();
  const qc = useQueryClient();
  const blank = { name: "", subject: "", experience: "", photo_url: "", bio: "", slug: "", email: "", phone: "", whatsapp: "", instagram: "", facebook: "", linkedin: "", twitter: "", website: "", show_contact: false, sort: 0 };
  const [editing, setEditing] = useState<any>(blank);
  const [isNew, setIsNew] = useState(true);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const save = async () => {
    const payload: any = { ...editing };
    if (!payload.slug && payload.name) payload.slug = slugify(payload.name) + "-" + Math.random().toString(36).slice(2,6);
    let res;
    if (isNew) { delete payload.id; res = await supabase.from("teachers").insert(payload); }
    else res = await supabase.from("teachers").update(payload).eq("id", editing.id);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["teachers"] });
    setEditing(blank); setIsNew(true);
  };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("teachers").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["teachers"] }); };

  const createInvite = async (teacherId: string) => {
    const token = crypto.randomUUID().replace(/-/g, "");
    const { error } = await supabase.from("teacher_invites").insert({ teacher_id: teacherId, token });
    if (error) return toast.error(error.message);
    const link = `${window.location.origin}/teacher/edit/${token}`;
    setInviteLink(link);
    navigator.clipboard?.writeText(link).catch(() => {});
    toast.success("Invite link copied");
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Teachers</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold">{isNew ? "Add new teacher" : "Edit teacher"}</h3>
          <div><Label>Name</Label><Input value={editing.name ?? ""} onChange={(e)=>setEditing({...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value)})} /></div>
          <div><Label>Subject</Label><Input value={editing.subject ?? ""} onChange={(e)=>setEditing({...editing, subject: e.target.value})} /></div>
          <div><Label>URL slug</Label><Input value={editing.slug ?? ""} onChange={(e)=>setEditing({...editing, slug: e.target.value})} placeholder="jane-math" /></div>
          <div><Label>Experience (optional)</Label><Input value={editing.experience ?? ""} onChange={(e)=>setEditing({...editing, experience: e.target.value})} /></div>
          <div><Label>Bio (optional)</Label><Textarea rows={3} value={editing.bio ?? ""} onChange={(e)=>setEditing({...editing, bio: e.target.value})} /></div>
          <div><Label>Photo</Label>
            <Dropzone value={editing.photo_url} onChange={(url)=>setEditing({...editing, photo_url: url})} accept="image/*" folder="teachers" />
          </div>
          <details className="rounded-lg border p-3">
            <summary className="cursor-pointer text-sm font-semibold">Optional contact info</summary>
            <div className="mt-3 grid gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!editing.show_contact} onChange={(e)=>setEditing({...editing, show_contact: e.target.checked})} />
                Show contact info on public profile
              </label>
              <Input placeholder="Email" value={editing.email ?? ""} onChange={(e)=>setEditing({...editing, email: e.target.value})} />
              <Input placeholder="Phone" value={editing.phone ?? ""} onChange={(e)=>setEditing({...editing, phone: e.target.value})} />
              <Input placeholder="WhatsApp number" value={editing.whatsapp ?? ""} onChange={(e)=>setEditing({...editing, whatsapp: e.target.value})} />
              <Input placeholder="Instagram URL" value={editing.instagram ?? ""} onChange={(e)=>setEditing({...editing, instagram: e.target.value})} />
              <Input placeholder="Facebook URL" value={editing.facebook ?? ""} onChange={(e)=>setEditing({...editing, facebook: e.target.value})} />
              <Input placeholder="LinkedIn URL" value={editing.linkedin ?? ""} onChange={(e)=>setEditing({...editing, linkedin: e.target.value})} />
              <Input placeholder="Twitter/X URL" value={editing.twitter ?? ""} onChange={(e)=>setEditing({...editing, twitter: e.target.value})} />
              <Input placeholder="Website" value={editing.website ?? ""} onChange={(e)=>setEditing({...editing, website: e.target.value})} />
            </div>
          </details>
          <div><Label>Sort</Label><Input type="number" value={editing.sort ?? 0} onChange={(e)=>setEditing({...editing, sort: Number(e.target.value)})} /></div>
          <div className="flex gap-2">
            <SoundButton onClick={save}>{isNew ? "Add" : "Save"}</SoundButton>
            {!isNew && <SoundButton variant="outline" onClick={() => { setEditing(blank); setIsNew(true); }}>Cancel</SoundButton>}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Existing teachers</h3>
          {inviteLink && (
            <div className="rounded-lg border p-3 bg-secondary/50 text-xs break-all">
              <div className="font-semibold mb-1 flex items-center gap-1"><LinkIcon className="h-3 w-3" /> Invite link (copied)</div>
              {inviteLink}
            </div>
          )}
          {data?.map((row: any) => (
            <div key={row.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm">
                  <div className="font-semibold">{row.name}</div>
                  <div className="text-muted-foreground">{row.subject}</div>
                  {row.slug && <div className="text-xs text-primary mt-1">/teachers/{row.slug}</div>}
                </div>
                <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                  <SoundButton variant="outline" onClick={() => { setEditing(row); setIsNew(false); }}>Edit</SoundButton>
                  <SoundButton variant="outline" onClick={() => createInvite(row.id)}>Invite teacher</SoundButton>
                  <SoundButton variant="outline" onClick={() => del(row.id)}>Del</SoundButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* CONTACTS */
function ContactsTab() {
  const { data } = useContacts();
  const qc = useQueryClient();
  const blank = { platform: "", label: "", url: "", icon: "Link", sort: 0 };
  const [editing, setEditing] = useState<any>(blank);
  const [isNew, setIsNew] = useState(true);
  const save = async () => {
    const payload: any = { ...editing };
    let res;
    if (isNew) { delete payload.id; res = await supabase.from("contacts").insert(payload); }
    else res = await supabase.from("contacts").update(payload).eq("id", editing.id);
    if (res.error) return toast.error(res.error.message);
    qc.invalidateQueries({ queryKey: ["contacts"] });
    setEditing(blank); setIsNew(true);
  };
  const del = async (id: string) => { await supabase.from("contacts").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["contacts"] }); };
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Contact Links</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div><Label>Platform (e.g. whatsapp, instagram)</Label><Input value={editing.platform ?? ""} onChange={(e)=>setEditing({...editing, platform: e.target.value})} /></div>
          <div><Label>Label (optional)</Label><Input value={editing.label ?? ""} onChange={(e)=>setEditing({...editing, label: e.target.value})} /></div>
          <div><Label>URL</Label><Input value={editing.url ?? ""} onChange={(e)=>setEditing({...editing, url: e.target.value})} /></div>
          <div><Label>Lucide icon name</Label><Input value={editing.icon ?? ""} onChange={(e)=>setEditing({...editing, icon: e.target.value})} placeholder="Instagram, Facebook, MessageCircle, Youtube, Twitter, Link" /></div>
          <div><Label>Sort</Label><Input type="number" value={editing.sort ?? 0} onChange={(e)=>setEditing({...editing, sort: Number(e.target.value)})} /></div>
          <div className="flex gap-2">
            <SoundButton onClick={save}>{isNew ? "Add" : "Save"}</SoundButton>
            {!isNew && <SoundButton variant="outline" onClick={() => { setEditing(blank); setIsNew(true); }}>Cancel</SoundButton>}
          </div>
        </div>
        <div className="space-y-2">
          {data?.map((row: any) => (
            <div key={row.id} className="rounded-lg border p-3 flex items-start justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold">{row.label || row.platform}</div>
                <div className="text-muted-foreground truncate max-w-[220px]">{row.url}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <SoundButton variant="outline" onClick={() => { setEditing(row); setIsNew(false); }}>Edit</SoundButton>
                <SoundButton variant="outline" onClick={() => del(row.id)}>Del</SoundButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* MUSIC / MAP / PHONE */
function MusicTab() {
  const { data: s } = useSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (s) setForm(s); }, [s]);
  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      music_url: form.music_url, music_enabled: !!form.music_enabled,
      location_text: form.location_text, map_url: form.map_url,
      contact_phone: form.contact_phone,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    toast.success("Saved");
  };
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Music, map & quick contact</h2>

      <div><Label>Background music</Label>
        <Dropzone value={form.music_url} onChange={(url)=>setForm({...form, music_url: url})} accept="audio/*" folder="music" preview="audio" label="Drop an mp3 or audio file" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!form.music_enabled} onChange={(e)=>setForm({...form, music_enabled: e.target.checked})} />
        Show background music button on site
      </label>

      <div><Label>Location text (optional)</Label><Textarea rows={2} value={form.location_text ?? ""} onChange={(e)=>setForm({...form, location_text: e.target.value})} /></div>
      <div><Label>Google Maps embed URL (optional)</Label>
        <Dropzone value={form.map_url} onChange={(url)=>setForm({...form, map_url: url})} accept="image/*" folder="map" preview="none" label="Drop a map image, or paste an embed URL below" />
      </div>

      <div className="rounded-lg border p-4 bg-secondary/30">
        <Label>Quick-contact phone (private — admins only)</Label>
        <Input value={form.contact_phone ?? ""} onChange={(e)=>setForm({...form, contact_phone: e.target.value})} placeholder="+92 300 1234567" />
        <p className="text-xs text-muted-foreground mt-1">Shown as a floating WhatsApp button at the bottom-left corner of every page.</p>
      </div>

      <SoundButton onClick={save}>Save changes</SoundButton>
    </div>
  );
}

/* ADMINS */
function AdminsTab({ isMainAdmin, currentUserId }: { isMainAdmin: boolean; currentUserId: string }) {
  const [invites, setInvites] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const listAdminsFn = useServerFn(listAdmins);
  const findUserFn = useServerFn(findUserIdByEmail);

  const load = async () => {
    const [{ data: inv }, rolesWithEmails] = await Promise.all([
      supabase.from("admin_invites").select("*"),
      listAdminsFn({} as any).catch((e) => { toast.error(e.message); return []; }),
    ]);
    setInvites(inv ?? []);
    setAdmins(rolesWithEmails ?? []);
  };
  useEffect(() => { load(); }, []);

  const invite = async () => {
    if (!email) return;
    const { error } = await supabase.from("admin_invites").insert({ email: email.toLowerCase(), role: "admin" });
    if (error) return toast.error(error.message);
    setEmail("");
    toast.success("Invited. When they sign up they become an admin.");
    load();
  };
  const removeInvite = async (id: string) => { await supabase.from("admin_invites").delete().eq("id", id); load(); };
  const removeAdmin = async (userId: string, role: string) => {
    if (role === "main_admin" && !isMainAdmin) return toast.error("Only main admin can do that");
    if (userId === currentUserId && role === "main_admin") return toast.error("Transfer ownership first");
    if (!confirm("Remove this admin role?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as any);
    if (error) return toast.error(error.message);
    load();
  };
  const transferOwnership = async () => {
    const target = prompt("Email of the new main admin (they must already have an account):");
    if (!target) return;
    try {
      const found = await findUserFn({ data: { email: target } });
      await supabase.from("user_roles").insert({ user_id: found.id, role: "main_admin" as any });
      await supabase.from("user_roles").delete().eq("user_id", currentUserId).eq("role", "main_admin" as any);
      toast.success("Ownership transferred");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admins</h2>
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-2">Invite by email</h3>
        <div className="flex gap-2">
          <Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="person@example.com" type="email" />
          <SoundButton onClick={invite}>Invite</SoundButton>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Becomes an admin automatically the first time they sign up with that email.</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Pending invites</h3>
        {invites.length === 0 && <div className="text-sm text-muted-foreground">No pending invites.</div>}
        <div className="space-y-2">
          {invites.map((i) => (
            <div key={i.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div>{i.email} <span className="text-muted-foreground">— {i.role}</span></div>
              <SoundButton variant="outline" onClick={() => removeInvite(i.id)}>Remove</SoundButton>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Current admins</h3>
        <div className="space-y-2">
          {admins.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div>
                <div className="font-semibold">{a.email || "(unknown email)"}</div>
                <div className="font-mono text-xs text-muted-foreground">{a.user_id}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${a.role === "main_admin" ? "bg-brand-gradient text-white" : "bg-secondary"}`}>{a.role}</span>
                {a.email && (
                  <button onClick={() => { navigator.clipboard?.writeText(a.email); toast.success("Email copied"); }}
                    className="p-1 rounded hover:bg-secondary" title="Copy email"><Copy className="h-3.5 w-3.5" /></button>
                )}
                <SoundButton variant="outline" onClick={() => removeAdmin(a.user_id, a.role)}>Remove</SoundButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isMainAdmin && (
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Transfer main-admin ownership</h3>
          <p className="text-sm text-muted-foreground mb-3">You will remain a regular admin.</p>
          <SoundButton onClick={transferOwnership}><Crown className="h-4 w-4" /> Transfer ownership</SoundButton>
        </div>
      )}
    </div>
  );
}
