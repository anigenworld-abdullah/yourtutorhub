import { useTranslation } from "react-i18next";
import { useSettings } from "@/lib/site-data";

export function Footer() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} {settings?.tuition_name ?? "BrightMinds"} — {t("footer.rights")}
    </footer>
  );
}
