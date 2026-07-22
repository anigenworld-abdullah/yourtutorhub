import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useTeachers } from "@/lib/site-data";
import { Section, Reveal } from "./primitives";

export function Teachers() {
  const { t } = useTranslation();
  const { data: teachers } = useTeachers();
  return (
    <Section id="teachers">
      <Reveal>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center">
          <span className="text-brand-gradient">{t("teachers.title")}</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers?.map((tc, i) => {
          const card = (
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, rotate: 1 }}
              className="rounded-2xl border bg-card p-6 text-center shadow-sm hover:shadow-xl transition h-full"
            >
              <div className="mx-auto h-28 w-28 rounded-full overflow-hidden bg-brand-gradient ring-4 ring-background shadow-lg">
                {tc.photo_url && <img src={tc.photo_url} className="h-full w-full object-cover" alt={tc.name} />}
              </div>
              <h3 className="mt-4 text-xl font-bold">{tc.name}</h3>
              <div className="text-sm font-semibold text-primary">{tc.subject}</div>
              {tc.experience && <div className="text-xs text-muted-foreground mt-1">{tc.experience} experience</div>}
              {tc.bio && <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{tc.bio}</p>}
              {tc.slug && <div className="mt-4 text-sm font-semibold text-primary">{t("teachers.viewProfile")} →</div>}
            </motion.div>
          );
          return tc.slug ? (
            <Link key={tc.id} to="/teachers/$slug" params={{ slug: tc.slug }}>{card}</Link>
          ) : (
            <div key={tc.id}>{card}</div>
          );
        })}
      </div>
    </Section>
  );
}
