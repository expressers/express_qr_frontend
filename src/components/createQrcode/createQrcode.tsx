import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { useLang } from "@/hooks";
import { cn } from "@/lib/utils";

/** Atalho tracejado "Novo QR code", usado no fim das listas e nos estados vazios. */
function CreateQrcode({ className }: { className?: string }) {
  const { translations } = useLang();
  const t = translations.components.CreateQrcode;

  return (
    <Link
      to="/dashboard/qrcode-generator"
      className={cn(
        "group flex min-h-14 items-center justify-center gap-2 rounded-xl border border-dashed border-input px-4 text-sm font-medium text-muted-foreground transition-[color,background-color,border-color,transform] duration-(--dur-fast) ease-(--ease-out) hover:border-foreground hover:bg-card hover:text-foreground active:scale-[.98]",
        className,
      )}>
      <Plus size={18} aria-hidden />
      {t.cta}
    </Link>
  );
}

export { CreateQrcode };
