import { useEffect, useRef, useState } from "react";
import { Music, Music2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/lib/site-data";
import { useSite } from "@/lib/site-context";

export function BgMusic() {
  const { data: settings } = useSettings();
  const { playClick } = useSite();
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.volume = 0.35;
  }, [settings?.music_url]);

  if (!settings?.music_enabled || !settings?.music_url) return null;

  const toggle = () => {
    playClick();
    const a = ref.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  return (
    <>
      <audio ref={ref} src={settings.music_url} loop />
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full btn-brand shadow-xl flex items-center justify-center"
        aria-label="Toggle music"
      >
        {playing ? <Music className="h-6 w-6 animate-pulse" /> : <Music2 className="h-6 w-6" />}
      </motion.button>
    </>
  );
}
