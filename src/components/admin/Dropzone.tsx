import { useCallback, useRef, useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  value?: string | null;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  folder?: string;
  preview?: "image" | "audio" | "video" | "none";
};

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export function Dropzone({ value, onChange, accept, label = "Drop a file or click to upload", folder = "misc", preview = "image" }: Props) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type || undefined,
      });
      if (error) throw error;
      const { data, error: sErr } = await supabase.storage.from("site-media").createSignedUrl(path, TEN_YEARS);
      if (sErr || !data) throw sErr || new Error("Failed to sign URL");
      onChange(data.signedUrl);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally { setBusy(false); }
  }, [folder, onChange]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition ${drag ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-secondary/50"}`}
      >
        {busy ? (
          <div className="flex items-center justify-center gap-2 py-4 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</div>
        ) : value ? (
          <div className="flex items-center gap-3 justify-center">
            {preview === "image" && <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover" />}
            {preview === "audio" && <audio src={value} controls className="max-w-full" />}
            {preview === "video" && <video src={value} className="h-16 rounded-lg" muted />}
            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{value}</div>
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(""); }} className="p-1 rounded hover:bg-secondary"><X className="h-4 w-4"/></button>
          </div>
        ) : (
          <div className="py-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
            <UploadCloud className="h-5 w-5" /> {label}
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      </div>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste a URL"
        className="w-full rounded-lg border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
