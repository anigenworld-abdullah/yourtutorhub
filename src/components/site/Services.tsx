import { useTranslation } from "react-i18next";
import { useServices } from "@/lib/site-data";
import { Section, Reveal } from "./primitives";
import { motion } from "framer-motion";

export function Services() {
  const { t } = useTranslation();
  const { data: services } = useServices();
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
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="group relative rounded-2xl overflow-hidden bg-card border shadow-sm hover:shadow-2xl transition"
          >
            <div className="aspect-video bg-brand-gradient relative overflow-hidden">
              {s.media_url && s.media_type === "image" && (
                <img src={s.media_url} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
              )}
              {s.media_url && s.media_type === "video" && (
                <video src={s.media_url} className="absolute inset-0 h-full w-full object-cover" muted loop autoPlay playsInline />
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
