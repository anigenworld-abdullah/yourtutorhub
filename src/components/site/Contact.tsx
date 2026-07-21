import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useContacts, useSettings } from "@/lib/site-data";
import { Section, Reveal } from "./primitives";
import { MapPin } from "lucide-react";

export function Contact() {
  const { t } = useTranslation();
  const { data: contacts } = useContacts();
  const { data: settings } = useSettings();
  return (
    <Section id="contact" className="bg-secondary/40">
      <Reveal>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center">
          <span className="text-brand-gradient">{t("contact.title")}</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          {contacts?.map((c, i) => {
            const Icon = ((Icons as any)[c.icon || "Link"] || Icons.Link) as React.ComponentType<any>;
            return (
              <motion.a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 6, scale: 1.02 }}
                className="flex items-center gap-4 rounded-2xl bg-card border p-4 hover:shadow-lg transition"
              >
                <div className="h-12 w-12 rounded-xl bg-brand-gradient flex items-center justify-center text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold capitalize">{c.label || c.platform}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">{c.url}</div>
                </div>
              </motion.a>
            );
          })}
        </div>
        {(settings?.location_text || settings?.map_url) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex items-center gap-2 font-semibold">
              <MapPin className="h-5 w-5 text-primary" /> {t("contact.location")}
            </div>
            {settings?.location_text && <p className="mt-3 text-muted-foreground">{settings.location_text}</p>}
            {settings?.map_url && (
              <div className="mt-4 aspect-video rounded-xl overflow-hidden">
                <iframe src={settings.map_url} className="w-full h-full border-0" loading="lazy" />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Section>
  );
}
