import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import i18n, { RTL_LANGS } from "./i18n";

export type ThemeName = "sunset" | "ocean" | "forest" | "candy" | "midnight" | "royal";
export const THEMES: { id: ThemeName; label: string; swatch: string }[] = [
  { id: "sunset", label: "Sunset", swatch: "linear-gradient(135deg,#ff8a3d,#ff5aa8)" },
  { id: "ocean", label: "Ocean", swatch: "linear-gradient(135deg,#2b7fff,#3ad9c9)" },
  { id: "forest", label: "Forest", swatch: "linear-gradient(135deg,#3aa864,#b8d43a)" },
  { id: "candy", label: "Candy", swatch: "linear-gradient(135deg,#ff5aa8,#7fd0ff)" },
  { id: "midnight", label: "Midnight", swatch: "linear-gradient(135deg,#7b5cff,#2ac9d9)" },
  { id: "royal", label: "Royal", swatch: "linear-gradient(135deg,#4a2fbf,#f0b23a)" },
];

type SiteCtx = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  lang: string;
  setLang: (l: string) => void;
  soundOn: boolean;
  toggleSound: () => void;
  playClick: () => void;
};

const Ctx = createContext<SiteCtx | null>(null);
export const useSite = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite outside provider");
  return c;
};

export function SiteProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("sunset");
  const [lang, setLangState] = useState("en");
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const t = (localStorage.getItem("theme") as ThemeName) || "sunset";
    const l = localStorage.getItem("lang") || "en";
    const s = localStorage.getItem("soundOn");
    setThemeState(t);
    setLangState(l);
    if (s !== null) setSoundOn(s === "1");
    document.documentElement.setAttribute("data-theme", t);
    i18n.changeLanguage(l);
    document.documentElement.setAttribute("dir", RTL_LANGS.has(l) ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
  }, []);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };
  const setLang = (l: string) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    i18n.changeLanguage(l);
    document.documentElement.setAttribute("dir", RTL_LANGS.has(l) ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
  };
  const toggleSound = () => {
    setSoundOn((v) => {
      localStorage.setItem("soundOn", v ? "0" : "1");
      return !v;
    });
  };
  const playClick = () => {
    if (!soundOn || typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {}
  };

  return (
    <Ctx.Provider value={{ theme, setTheme, lang, setLang, soundOn, toggleSound, playClick }}>
      {children}
    </Ctx.Provider>
  );
}
