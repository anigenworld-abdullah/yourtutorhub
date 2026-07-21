import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useFaqs } from "@/lib/site-data";
import { Section, Reveal } from "./primitives";

export function WhyUs() {
  const { t } = useTranslation();
  const { data: faqs } = useFaqs();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Section id="why" className="bg-secondary/40">
      <Reveal>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center">
          <span className="text-brand-gradient">{t("why.title")}</span>
        </h2>
      </Reveal>
      <div className="mt-12 max-w-3xl mx-auto space-y-3">
        {faqs?.map((f, i) => {
          const isOpen = open === f.id;
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : f.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold hover:bg-secondary/50 transition"
              >
                <span>{f.question}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                  <ChevronDown className="h-5 w-5" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 text-muted-foreground"
                  >
                    {f.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
