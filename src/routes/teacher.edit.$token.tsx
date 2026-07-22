import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SoundButton, FloatingBlobs } from "@/components/site/primitives";
import { Dropzone } from "@/components/admin/Dropzone";

export const Route = createFileRoute("/teacher/edit/$token")({
  head: () => ({ meta: [{ title: "Edit your profile" }, { name: "robots", content: "noindex" }] }),
  component: TeacherEdit,
});

function TeacherEdit() {
  const { token } = Route.useParams();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: inv } = await supabase.from("teacher_invites").select("teacher_id").eq("token", token).maybeSingle();
      if (!inv) { setLoading(false); return; }
      setTeacherId(inv.teacher_id);
      const { data: teacher } = await supabase.from("teachers").select("*").eq("id", inv.teacher_id).maybeSingle();
      if (teacher) setForm(teacher);
      setLoading(false);
    })();
  }, [token]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.rpc("update_teacher_via_invite", {
      _token: token,
      _name: form.name ?? null,
      _subject: form.subject ?? null,
      _bio: form.bio ?? null,
      _experience: form.experience ?? null,
      _photo_url: form.photo_url ?? null,
      _email: form.email ?? null,
      _phone: form.phone ?? null,
      _whatsapp: form.whatsapp ?? null,
      _instagram: form.instagram ?? null,
      _facebook: form.facebook ?? null,
      _linkedin: form.linkedin ?? null,
      _twitter: form.twitter ?? null,
      _website: form.website ?? null,
      _show_contact: !!form.show_contact,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!teacherId) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Invalid or expired link</h1>
        <p className="text-muted-foreground mt-2">Please ask your admin for a new invite link.</p>
      </div>
    </div>
  );

  const F = (k: string, label: string, type: "text" | "textarea" = "text") => (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea rows={3} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className="w-full rounded-lg border bg-background px-3 py-2" />
      ) : (
        <input value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className="w-full rounded-lg border bg-background px-3 py-2" />
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen py-16 px-4 overflow-hidden">
      <FloatingBlobs />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative max-w-2xl mx-auto rounded-3xl border bg-card p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-extrabold text-brand-gradient">Edit your profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in what you're comfortable sharing. Everything except name and subject is optional.</p>
        <div className="mt-6 grid gap-4">
          {F("name", "Name")}
          {F("subject", "Subject")}
          {F("experience", "Experience (optional)")}
          {F("bio", "Bio (optional)", "textarea")}
          <div>
            <label className="text-sm font-medium block mb-1">Profile photo</label>
            <Dropzone value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} accept="image/*" folder="teachers" />
          </div>
          <div className="pt-2 border-t">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.show_contact} onChange={(e) => setForm({ ...form, show_contact: e.target.checked })} />
              Show my contact details on my public profile
            </label>
          </div>
          {F("email", "Email (optional)")}
          {F("phone", "Phone (optional)")}
          {F("whatsapp", "WhatsApp number (optional)")}
          {F("instagram", "Instagram URL (optional)")}
          {F("facebook", "Facebook URL (optional)")}
          {F("linkedin", "LinkedIn URL (optional)")}
          {F("twitter", "Twitter/X URL (optional)")}
          {F("website", "Website (optional)")}
          <SoundButton onClick={save} className="w-full">{saving ? "Saving…" : "Save profile"}</SoundButton>
        </div>
      </motion.div>
    </div>
  );
}
