import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Globe, Palette, Volume2, VolumeX, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSite, THEMES } from "@/lib/site-context";
import { useSettings } from "@/lib/site-data";
import { SoundButton } from "./primitives";

const LANGS = [
  { id: "en", label: "English" },
  { id: "ur", label: "اردو" },
  { id: "hi", label: "हिन्दी" },
  { id: "ar", label: "العربية" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
];

export function Navbar() {
  const { t } = useTranslation();
  const { theme, setTheme, lang, setLang, soundOn, toggleSound } = useSite();
  const { data: settings } = useSettings();
  const [openMenu, setOpenMenu] = useState<null | "theme" | "lang">(null);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border/60"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="logo" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-brand-gradient" />
          )}
          <span className="font-extrabold text-lg text-brand-gradient">
            {settings?.tuition_name ?? "BrightMinds"}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#services" className="hover:text-primary transition">{t("nav.services")}</a>
          <a href="#why" className="hover:text-primary transition">{t("nav.why")}</a>
          <a href="#teachers" className="hover:text-primary transition">{t("nav.teachers")}</a>
          <a href="#contact" className="hover:text-primary transition">{t("nav.contact")}</a>
        </nav>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SoundButton variant="ghost" onClick={() => setOpenMenu(openMenu === "lang" ? null : "lang")}>
              <Globe className="h-4 w-4" />
            </SoundButton>
            {openMenu === "lang" && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
                {LANGS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => { setLang(l.id); setOpenMenu(null); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-secondary ${lang === l.id ? "font-bold text-primary" : ""}`}
                  >{l.label}</button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <SoundButton variant="ghost" onClick={() => setOpenMenu(openMenu === "theme" ? null : "theme")}>
              <Palette className="h-4 w-4" />
            </SoundButton>
            {openMenu === "theme" && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-popover shadow-xl p-2 grid grid-cols-3 gap-2">
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => { setTheme(th.id); setOpenMenu(null); }}
                    className={`h-10 rounded-lg ring-2 ${theme === th.id ? "ring-primary" : "ring-transparent"} hover:scale-105 transition`}
                    style={{ background: th.swatch }}
                    title={th.label}
                  />
                ))}
              </div>
            )}
          </div>
          <SoundButton variant="ghost" onClick={toggleSound}>
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </SoundButton>
          <Link to="/admin">
            <SoundButton variant="outline"><ShieldCheck className="h-4 w-4" /> Admin</SoundButton>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
