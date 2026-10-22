import { Link } from "react-router-dom";
import { Skeleton } from "../ui";
import { useLang } from "@/hooks";
import type { MyPlan, QrType } from "@/service/api";
import { formatLimit, getTypeUsage } from "@/utils";
import { cn } from "@/lib/utils";

interface PlanUsageCardProps {
  myPlan: MyPlan | undefined;
  isLoading: boolean;
  type: QrType;
  title: string;
  className?: string;
}

/**
 * "N de M" de um tipo de QR, com "Pedir upgrade" quando chega ao limite.
 * Sem moldura própria: vive numa linha de métricas separada por hairlines.
 */
function PlanUsageCard({ myPlan, isLoading, type, title, className }: PlanUsageCardProps) {
  const { translations } = useLang();
  const t = translations.components.CreateQrcode.usage;
  const { used, limit, atLimit } = getTypeUsage(myPlan, type);
  const bounded = limit !== undefined && limit !== -1 && limit > 0;
  const ratio = bounded ? Math.min(used / limit, 1) : 0;

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      {isLoading ? (
        <Skeleton className="h-9 w-28" />
      ) : (
        <p className="font-mono text-3xl font-semibold leading-none tracking-tight tabular-nums">
          {limit === -1
            ? `${used} · ${t.unlimited}`
            : t.of.replace("{used}", String(used)).replace("{limit}", formatLimit(limit))}
        </p>
      )}
      {bounded && !isLoading && (
        <div
          role="meter"
          aria-label={`${title}: ${t.label}`}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuenow={Math.min(used, limit)}
          className="h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full origin-left rounded-full bg-foreground transition-transform duration-(--dur-slow) ease-(--ease-out)"
            style={{ transform: `scaleX(${ratio})` }}
          />
        </div>
      )}
      {atLimit && (
        <p className="text-sm font-medium">
          {t.limitReached} ·{" "}
          <Link to="/subscriber" className="underline underline-offset-4">
            {t.upgrade}
          </Link>
        </p>
      )}
    </div>
  );
}

export { PlanUsageCard };
