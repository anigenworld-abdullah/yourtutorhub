import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { SoundButton } from "./primitives";
import { useTranslation } from "react-i18next";

export function InstallPWA() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: any) => { e.preventDefault(); setPrompt(e); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || !prompt) return null;

  return (
    <SoundButton variant="outline" onClick={async () => { await prompt.prompt(); setPrompt(null); }}>
      <Download className="h-4 w-4" /> {t("nav.install")}
    </SoundButton>
  );
}
