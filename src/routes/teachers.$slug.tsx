import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MessageCircle, Instagram, Facebook, Linkedin, Twitter, Globe } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingBlobs } from "@/components/site/primitives";
import { useTeacherBySlug } from "@/lib/site-data";

export const Route = createFileRoute("/teachers/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Tutor Profile — ${params.slug}` },
      { name: "description", content: "Meet our expert tutor." },
      { property: "og:title", content: `Tutor Profile` },
      { property: "og:description", content: "Meet our expert tutor." },
    ],
  }),
  component: TeacherPage,
});

function TeacherPage() {
  const { slug } = Route.useParams();
  const { data: t, isLoading } = useTeacherBySlug(slug);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative pt-32 pb-20 px-6 overflow-hidden">
        <FloatingBlobs />
        <div className="relative max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading…</div>
          ) : !t ? (
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold">Tutor not found</h1>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="rounded-3xl border bg-card p-8 md:p-12 shadow-xl"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <motion.div
                  initial={{ scale: 0.7, rotate: -8, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 14, delay: 0.1 }}
                  className="h-40 w-40 rounded-full overflow-hidden bg-brand-gradient ring-4 ring-background shadow-2xl shrink-0"
                >
                  {t.photo_url && <img src={t.photo_url} alt={t.name} className="h-full w-full object-cover" />}
                </motion.div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gradient">{t.name}</h1>
                  <div className="mt-2 text-lg font-semibold text-primary">{t.subject}</div>
                  {t.experience && <div className="mt-1 text-sm text-muted-foreground">{t.experience} experience</div>}
                  {t.bio && <p className="mt-5 text-muted-foreground leading-relaxed">{t.bio}</p>}
                </div>
              </div>

              {t.show_contact && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="mt-10 grid sm:grid-cols-2 gap-3"
                >
                  <ContactLink icon={Mail} label={t.email} href={t.email ? `mailto:${t.email}` : null} />
                  <ContactLink icon={Phone} label={t.phone} href={t.phone ? `tel:${t.phone}` : null} />
                  <ContactLink icon={MessageCircle} label={t.whatsapp && `WhatsApp: ${t.whatsapp}`} href={t.whatsapp ? `https://wa.me/${t.whatsapp.replace(/\D/g,'')}` : null} />
                  <ContactLink icon={Instagram} label={t.instagram} href={t.instagram} />
                  <ContactLink icon={Facebook} label={t.facebook} href={t.facebook} />
                  <ContactLink icon={Linkedin} label={t.linkedin} href={t.linkedin} />
                  <ContactLink icon={Twitter} label={t.twitter} href={t.twitter} />
                  <ContactLink icon={Globe} label={t.website} href={t.website} />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ContactLink({ icon: Icon, label, href }: { icon: any; label?: string | null; href?: string | null }) {
  if (!href || !label) return null;
  return (
    <motion.a whileHover={{ x: 4, scale: 1.02 }} href={href} target="_blank" rel="noreferrer"
      className="flex items-center gap-3 rounded-xl border bg-background p-3 hover:shadow-md transition">
      <div className="h-10 w-10 rounded-lg bg-brand-gradient flex items-center justify-center text-white shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-sm truncate">{label}</div>
    </motion.a>
  );
}
