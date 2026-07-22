import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SoundButton, FloatingBlobs } from "@/components/site/primitives";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Your Tutor Hub" }, { name: "description", content: "Sign in or create your account." }] }),
  validateSearch: (s: Record<string, unknown>) => ({ mode: (s.mode === "signup" ? "signup" : "signin") as "signin" | "signup" }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created. You may need to verify your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally { setLoading(false); }
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <FloatingBlobs />
      <motion.div
        initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="fixed top-6 left-6 z-10"
      >
        <Link to="/">
          <SoundButton variant="outline"><ArrowLeft className="h-4 w-4" /> {t("nav.back")}</SoundButton>
        </Link>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 220 }}
          className="relative w-full max-w-md rounded-3xl border bg-card p-8 shadow-2xl"
        >
          <h1 className="text-3xl font-extrabold text-center text-brand-gradient">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Sign in to continue" : "Sign up to get started"}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
            <SoundButton type="submit" className="w-full">
              {loading ? "..." : mode === "signin" ? "Sign in" : "Sign up"}
            </SoundButton>
          </form>
          <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" /> or <div className="h-px bg-border flex-1" />
          </div>
          <SoundButton variant="outline" onClick={google} className="w-full">Continue with Google</SoundButton>
          <div className="mt-6 text-center text-sm">
            {mode === "signin" ? (
              <button className="text-primary font-semibold" onClick={() => setMode("signup")}>Create an account</button>
            ) : (
              <button className="text-primary font-semibold" onClick={() => setMode("signin")}>I already have an account</button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
