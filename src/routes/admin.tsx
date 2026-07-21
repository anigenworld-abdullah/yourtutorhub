import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LogOut, Home, Settings, Wrench, HelpCircle, Users, Phone, Music, ShieldPlus, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { useSettings, useServices, useFaqs, useTeachers, useContacts } from "@/lib/site-data";
import { SoundButton } from "@/components/site/primitives";
import { THEMES } from "@/lib/site-context";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — BrightMinds" }, { name: "robots", content: "noindex" }] }),
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
  { id: "music", label: "Music & Location", Icon: Music },
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
          <Link to="/" className="font-extrabold text-brand-gradient text-lg">BrightMinds Admin</Link>
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

/* --------------------- helpers --------------------- */

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${props.className ?? ""}`} />;
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${props.className ?? ""}`} />;
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium block mb-1">{children}</label>;
}

/* --------------------- BRANDING --------------------- */

function BrandingTab() {
  const { data: s } = useSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (s) setForm(s); }, [s]);

  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      tuition_name: form.tuition_name, logo_url: form.logo_url, theme: form.theme, default_language: form.default_language,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Branding</h2>
      <div><Label>Tuition name</Label><Input value={form.tuition_name ?? ""} onChange={(e)=>setForm({...form, tuition_name: e.target.value})} /></div>
      <div><Label>Logo URL</Label><Input value={form.logo_url ?? ""} onChange={(e)=>setForm({...form, logo_url: e.target.value})} placeholder="https://..." /></div>
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

/* --------------------- HERO --------------------- */

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
      <div><Label>Background image URL (optional)</Label><Input value={form.hero_bg_url ?? ""} onChange={(e)=>setForm({...form, hero_bg_url: e.target.value})} /></div>
      <SoundButton onClick={save}>Save changes</SoundButton>
    </div>
  );
}

/* --------------------- CRUD LIST GENERIC --------------------- */

function CrudSection({
  title, table, queryKey, columns, useData, blank,
}: {
  title: string; table: string; queryKey: string;
  columns: { key: string; label: string; type?: "text" | "textarea" | "url" | "number" }[];
  useData: () => { data?: any[] | null };
  blank: Record<string, any>;
}) {
  const { data } = useData();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(blank);
  const [isNew, setIsNew] = useState(true);

  const load = (row: T) => { setEditing(row); setIsNew(false); };
  const reset = () => { setEditing(blank); setIsNew(true); };
  const save = async () => {
    const payload = { ...editing };
    let res;
    if (isNew) { delete payload.id; res = await (supabase.from(table as any) as any).insert(payload); }
    else res = await (supabase.from(table as any) as any).update(payload).eq("id", editing.id);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: [queryKey] });
    reset();
  };
  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await (supabase.from(table as any) as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: [queryKey] });
    toast.success("Deleted");
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold">{isNew ? "Add new" : "Edit"}</h3>
          {columns.map((c) => (
            <div key={String(c.key)}>
              <Label>{c.label}</Label>
              {c.type === "textarea" ? (
                <Textarea rows={4} value={(editing as any)[c.key] ?? ""} onChange={(e)=>setEditing({...editing, [c.key]: e.target.value})} />
              ) : (
                <Input type={c.type === "number" ? "number" : "text"} value={(editing as any)[c.key] ?? ""} onChange={(e)=>setEditing({...editing, [c.key]: c.type === "number" ? Number(e.target.value) : e.target.value})} />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <SoundButton onClick={save}>{isNew ? "Add" : "Save"}</SoundButton>
            {!isNew && <SoundButton variant="outline" onClick={reset}>Cancel</SoundButton>}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Existing</h3>
          {data?.map((row: any) => (
            <div key={row.id} className="rounded-lg border p-3 flex items-start justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold">{row.title ?? row.name ?? row.question ?? row.platform}</div>
                <div className="text-muted-foreground line-clamp-2">{row.detail ?? row.answer ?? row.subject ?? row.url}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <SoundButton variant="outline" onClick={() => load(row)}>Edit</SoundButton>
                <SoundButton variant="outline" onClick={() => del(row.id)}>Del</SoundButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesTab() {
  return <CrudSection title="Services" table="services" queryKey="services" useData={useServices as any}
    blank={{ title: "", detail: "", media_url: "", media_type: "image", sort: 0 }}
    columns={[
      { key: "title", label: "Title" },
      { key: "detail", label: "Detail", type: "textarea" },
      { key: "media_url", label: "Image or video URL" },
      { key: "media_type", label: "media_type (image or video)" },
      { key: "sort", label: "Sort", type: "number" },
    ] as any} />;
}
function FaqsTab() {
  return <CrudSection title="Why Us Q&A" table="faqs" queryKey="faqs" useData={useFaqs as any}
    blank={{ question: "", answer: "", sort: 0 }}
    columns={[
      { key: "question", label: "Question" },
      { key: "answer", label: "Answer", type: "textarea" },
      { key: "sort", label: "Sort", type: "number" },
    ] as any} />;
}
function TeachersTab() {
  return <CrudSection title="Popular Teachers" table="teachers" queryKey="teachers" useData={useTeachers as any}
    blank={{ name: "", subject: "", experience: "", photo_url: "", bio: "", sort: 0 }}
    columns={[
      { key: "name", label: "Name" },
      { key: "subject", label: "Subject" },
      { key: "experience", label: "Experience (optional)" },
      { key: "photo_url", label: "Photo URL (optional)" },
      { key: "bio", label: "Bio (optional)", type: "textarea" },
      { key: "sort", label: "Sort", type: "number" },
    ] as any} />;
}
function ContactsTab() {
  return <CrudSection title="Contact Links" table="contacts" queryKey="contacts" useData={useContacts as any}
    blank={{ platform: "", label: "", url: "", icon: "Link", sort: 0 }}
    columns={[
      { key: "platform", label: "Platform (whatsapp, instagram, facebook, ...)" },
      { key: "label", label: "Label (optional)" },
      { key: "url", label: "URL or wa.me/number" },
      { key: "icon", label: "Icon name (lucide: Instagram, Facebook, MessageCircle, Youtube, Twitter, Link)" },
      { key: "sort", label: "Sort", type: "number" },
    ] as any} />;
}

/* --------------------- MUSIC + LOCATION --------------------- */

function MusicTab() {
  const { data: s } = useSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (s) setForm(s); }, [s]);
  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      music_url: form.music_url, music_enabled: !!form.music_enabled, location_text: form.location_text, map_url: form.map_url,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    toast.success("Saved");
  };
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Background music & location</h2>
      <div><Label>Background music URL (mp3)</Label><Input value={form.music_url ?? ""} onChange={(e)=>setForm({...form, music_url: e.target.value})} placeholder="https://..." /></div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!form.music_enabled} onChange={(e)=>setForm({...form, music_enabled: e.target.checked})} />
        Show background music button on site
      </label>
      <div><Label>Location text (optional)</Label><Textarea rows={2} value={form.location_text ?? ""} onChange={(e)=>setForm({...form, location_text: e.target.value})} /></div>
      <div><Label>Google Maps embed URL (optional)</Label><Input value={form.map_url ?? ""} onChange={(e)=>setForm({...form, map_url: e.target.value})} placeholder="https://www.google.com/maps/embed?..." /></div>
      <SoundButton onClick={save}>Save changes</SoundButton>
    </div>
  );
}

/* --------------------- ADMINS --------------------- */

function AdminsTab({ isMainAdmin, currentUserId }: { isMainAdmin: boolean; currentUserId: string }) {
  const [invites, setInvites] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  const load = async () => {
    const [{ data: inv }, { data: roles }] = await Promise.all([
      supabase.from("admin_invites").select("*"),
      supabase.from("user_roles").select("id, user_id, role"),
    ]);
    setInvites(inv ?? []);
    setAdmins(roles ?? []);
  };
  useEffect(() => { load(); }, []);

  const invite = async () => {
    if (!email) return;
    const { error } = await supabase.from("admin_invites").insert({ email: email.toLowerCase(), role: "admin" });
    if (error) return toast.error(error.message);
    setEmail("");
    toast.success("Invited. When they sign up, they will become an admin.");
    load();
  };
  const removeInvite = async (id: string) => {
    await supabase.from("admin_invites").delete().eq("id", id);
    load();
  };
  const removeAdmin = async (userId: string, role: string) => {
    if (role === "main_admin" && !isMainAdmin) return toast.error("Only main admin can do that");
    if (userId === currentUserId && role === "main_admin") return toast.error("Transfer ownership first");
    if (!confirm("Remove this admin role?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as any);
    if (error) return toast.error(error.message);
    load();
  };
  const transferOwnership = async () => {
    const target = prompt("Enter the new main admin's user ID (they must already be an admin).");
    if (!target) return;
    // grant main_admin to target, remove main_admin from self
    const { error: e1 } = await supabase.from("user_roles").insert({ user_id: target, role: "main_admin" as any });
    if (e1) return toast.error(e1.message);
    const { error: e2 } = await supabase.from("user_roles").delete().eq("user_id", currentUserId).eq("role", "main_admin" as any);
    if (e2) return toast.error(e2.message);
    toast.success("Ownership transferred");
    load();
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
        <p className="text-xs text-muted-foreground mt-2">The person becomes an admin automatically the first time they sign up with that email.</p>
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
              <div className="font-mono text-xs">{a.user_id}</div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${a.role === "main_admin" ? "bg-brand-gradient text-white" : "bg-secondary"}`}>{a.role}</span>
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
