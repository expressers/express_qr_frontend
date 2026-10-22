import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "../ui";
import { useLang } from "@/hooks";
import type { MyPlan, QrType } from "@/service/api";
import { formatLimit, getTypeUsage } from "@/utils";

interface PlanUsageCardProps {
  myPlan: MyPlan | undefined;
  isLoading: boolean;
  type: QrType;
  title: string;
}

/** "N de M" de um tipo de QR, com "Pedir upgrade" quando chega ao limite. */
function PlanUsageCard({ myPlan, isLoading, type, title }: PlanUsageCardProps) {
  const { translations } = useLang();
  const t = translations.components.CreateQrcode.usage;
  const { used, limit, atLimit } = getTypeUsage(myPlan, type);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <span className="text-2xl font-bold block">
            {limit === -1
              ? `${used} · ${t.unlimited}`
              : t.of
                  .replace("{used}", String(used))
                  .replace("{limit}", formatLimit(limit))}
          </span>
        )}
        {atLimit && (
          <p className="text-xs">
            {t.limitReached} ·{" "}
            <Link to="/subscriber" className="underline font-semibold">
              {t.upgrade}
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export { PlanUsageCard };
