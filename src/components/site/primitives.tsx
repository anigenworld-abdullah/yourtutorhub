import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode, type ComponentProps } from "react";
import { useSite } from "@/lib/site-context";

export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-24 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

export function Reveal({ children, delay = 0, y = 30 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Parallax({ children, offset = 60 }: { children: ReactNode; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

type BtnProps = ComponentProps<typeof motion.button> & { variant?: "primary" | "ghost" | "outline" };
export function SoundButton({ variant = "primary", className = "", children, onClick, ...rest }: BtnProps) {
  const { playClick } = useSite();
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition select-none";
  const styles = {
    primary: "btn-brand hover:brightness-110",
    ghost: "text-foreground/80 hover:text-foreground hover:bg-secondary",
    outline: "border border-border bg-background/60 backdrop-blur hover:bg-secondary",
  }[variant];
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        playClick();
        onClick?.(e as any);
      }}
      className={`${base} ${styles} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function FloatingBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full opacity-40 blur-3xl animate-floaty bg-brand-gradient" />
      <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full opacity-30 blur-3xl animate-floaty [animation-delay:2s]" style={{ background: "var(--brand-2)" }} />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full opacity-30 blur-3xl animate-floaty [animation-delay:4s]" style={{ background: "var(--brand-3)" }} />
    </div>
  );
}
