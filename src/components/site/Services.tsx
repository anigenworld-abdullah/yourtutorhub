import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useServices } from "@/lib/site-data";
import { Section, Reveal } from "./primitives";
import { motion } from "framer-motion";
import { ServiceModal } from "./ServiceModal";

export function Services() {
  const { t } = useTranslation();
  const { data: services } = useServices();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = openIdx !== null ? services?.[openIdx] ?? null : null;

  return (
    <Section id="services">
      <Reveal>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center">
          <span className="text-brand-gradient">{t("services.title")}</span>
        </h2>
        <p className="text-center mt-3 text-muted-foreground">{t("services.sub")}</p>
      </Reveal>
      <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((s, i) => (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => setOpenIdx(i)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="group relative text-left rounded-2xl overflow-hidden bg-card border shadow-sm hover:shadow-2xl transition cursor-pointer"
          >
            <div className="aspect-video bg-brand-gradient relative overflow-hidden">
              {s.media_url && s.media_type === "image" && (
                <img src={s.media_url} alt={s.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-500" />
              )}
              {s.media_url && s.media_type === "video" && (
                <video src={s.media_url} className="absolute inset-0 h-full w-full object-cover" muted loop autoPlay playsInline />
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.detail}</p>
              <div className="mt-3 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition">{t("services.details")} →</div>
            </div>
          </motion.button>
        ))}
      </div>
      <ServiceModal service={open as any} index={openIdx ?? 0} onClose={() => setOpenIdx(null)} />
    </Section>
  );
}
