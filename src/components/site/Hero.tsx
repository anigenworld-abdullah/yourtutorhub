import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap, Sparkles } from "lucide-react";
import { useSettings } from "@/lib/site-data";
import { FloatingBlobs, SoundButton } from "./primitives";

export function Hero() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden">
      <FloatingBlobs />
      {settings?.hero_bg_url && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${settings.hero_bg_url})` }}
        />
      )}
      <motion.div style={{ y, opacity }} className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" /> Home tutoring, made joyful
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight"
          >
            <span className="text-brand-gradient">
              {settings?.hero_title ?? "Learn From The Best Home Tutors"}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-5 text-lg text-muted-foreground max-w-xl"
          >
            {settings?.hero_subtitle ?? "Personalized one-on-one tutoring that helps students shine."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <SoundButton onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              <GraduationCap className="h-4 w-4" /> {settings?.book_cta_label || t("hero.cta")}
            </SoundButton>
            <SoundButton variant="outline" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
              {t("hero.secondary")}
            </SoundButton>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden aspect-square bg-brand-gradient shadow-2xl">
            <div className="absolute inset-0 grid grid-cols-3 gap-2 p-6 opacity-90">
              {["📚","✏️","🧮","🔬","🌍","💡","🎨","🎯","🏆"].map((e,i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="rounded-xl bg-white/25 backdrop-blur flex items-center justify-center text-4xl"
                >{e}</motion.div>
              ))}
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border"
          >
            <div className="h-10 w-10 rounded-full bg-brand-gradient" />
            <div>
              <div className="text-xs text-muted-foreground">Live now</div>
              <div className="text-sm font-bold">120+ students learning</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
