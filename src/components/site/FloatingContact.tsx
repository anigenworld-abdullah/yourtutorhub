import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/lib/site-data";

export function FloatingContact() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  const phone = settings?.contact_phone?.trim();
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const href = digits ? `https://wa.me/${digits}` : `tel:${phone}`;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={t("contact.quick")}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", damping: 14 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full btn-brand shadow-2xl"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
        <MessageCircle className="relative h-5 w-5" />
      </span>
      <span className="text-sm font-semibold hidden sm:inline">{t("contact.quick")}</span>
    </motion.a>
  );
}
