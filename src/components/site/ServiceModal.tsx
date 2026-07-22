import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

type Service = {
  id: string;
  title: string;
  detail: string;
  long_description?: string | null;
  media_url?: string | null;
  media_type?: string | null;
  extra_images?: any;
};

const DIRECTIONS = [
  { initial: { y: 120, opacity: 0, scale: 0.9 }, animate: { y: 0, opacity: 1, scale: 1 } },   // bottom
  { initial: { x: -120, opacity: 0, scale: 0.9 }, animate: { x: 0, opacity: 1, scale: 1 } },  // left
  { initial: { y: -120, opacity: 0, scale: 0.9 }, animate: { y: 0, opacity: 1, scale: 1 } },  // top
  { initial: { x: 120, opacity: 0, scale: 0.9 }, animate: { x: 0, opacity: 1, scale: 1 } },   // right
];

export function ServiceModal({ service, index, onClose }: { service: Service | null; index: number; onClose: () => void }) {
  useEffect(() => {
    if (!service) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [service, onClose]);

  const dir = DIRECTIONS[index % DIRECTIONS.length];
  const extras: string[] = Array.isArray(service?.extra_images) ? service!.extra_images : [];

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={dir.initial}
            animate={dir.animate}
            exit={dir.initial}
            transition={{ type: "spring", damping: 22, stiffness: 260, mass: 0.7 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl border bg-card shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <button onClick={onClose} className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur border flex items-center justify-center hover:scale-110 transition">
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-video bg-brand-gradient relative overflow-hidden shrink-0">
              {service.media_url && service.media_type === "image" && (
                <motion.img
                  initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }}
                  src={service.media_url} alt={service.title} className="absolute inset-0 h-full w-full object-cover" />
              )}
              {service.media_url && service.media_type === "video" && (
                <video src={service.media_url} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline />
              )}
            </div>
            <div className="p-6 overflow-y-auto">
              <motion.h3
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="text-2xl md:text-3xl font-extrabold text-brand-gradient"
              >{service.title}</motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-3 text-muted-foreground"
              >{service.long_description || service.detail}</motion.p>
              {extras.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {extras.map((src, i) => (
                    <motion.img
                      key={i} src={src} alt=""
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                      className="rounded-xl aspect-square object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
