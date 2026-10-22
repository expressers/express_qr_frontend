import { ArrowRight, QrCode, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { Button, Skeleton } from "@/components";
import {
  CardQrcode,
  QrEmptyState,
  QrList,
  QrListSkeleton,
} from "@/components/cardQrcode";
import { CreateQrcode, PlanUsageCard } from "@/components/createQrcode";
import { useGetMeplan, useGetQrcodes, useLang, useUserGetMe } from "@/hooks";
import { images } from "@/assets";
import { getImageUrl } from "@/config";

function Dashboard() {
  const { data, total, isLoading, error, refetchQrcodes } = useGetQrcodes();
  const { data: myPlan, isLoading: isLoadingPlan, refetch: refetchPlan } = useGetMeplan();
  const { translations } = useLang();
  useUserGetMe();
  const t = translations.pages.dashboard;

  // `data` é null até ao primeiro pedido terminar: nunca mostrar "vazio" nesse intervalo.
  const isPending = isLoading || data === null;

  const itemQrcode = (data ?? []).slice(0, 5).map((item) => ({
    id: item.id,
    title: item.title || t.noTitle,
    link:
      (item.targetUrl ?? item.staticContent)?.replace(/^https?:\/\//, "") ||
      t.noLink,
    date: item.createdAt,
    scans: item.scanCount ?? 0,
    type: item.type,
    isActive: item.isActive,
    image: getImageUrl(item.imageUrl ?? undefined) || images.qrCode.qr_code1,
  }));

  const handleDeleted = () => {
    refetchQrcodes();
    refetchPlan();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      {/* Métricas: tipografia grande, sem cartões, separadas por hairlines */}
      <section
        aria-label={t.title}
        className="grid grid-cols-1 gap-y-8 border-y py-6 md:grid-cols-3 md:gap-y-0 md:py-8">
        <div className="space-y-3 md:pr-8">
          <p className="text-sm text-muted-foreground">{t.totalQrcodes}</p>
          {isPending ? (
            <Skeleton className="h-9 w-16" />
          ) : (
            <p className="flex items-center gap-3 font-mono text-3xl font-semibold leading-none tracking-tight tabular-nums">
              {total}
              <QrCode size={22} strokeWidth={1.5} aria-hidden className="text-muted-foreground" />
            </p>
          )}
        </div>
        <PlanUsageCard
          className="md:border-l md:px-8"
          myPlan={myPlan}
          isLoading={isLoadingPlan}
          type="STATIC"
          title={t.staticUsage}
        />
        <PlanUsageCard
          className="md:border-l md:pl-8"
          myPlan={myPlan}
          isLoading={isLoadingPlan}
          type="DYNAMIC"
          title={t.dynamicUsage}
        />
      </section>

      <section className="space-y-4" aria-labelledby="recent-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="recent-heading" className="text-base font-semibold">
            {t.recent}
          </h2>
          <Link
            to="/dashboard/my-qrcodes"
            className="group inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-(--dur-fast) hover:text-foreground md:min-h-0">
            {t.viewAll}
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform duration-(--dur-fast) ease-(--ease-out) group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {isPending && !error ? (
          <QrListSkeleton count={3} />
        ) : error ? (
          <QrEmptyState
            role="alert"
            icon={TriangleAlert}
            title={t.loadError}
            action={
              <Button variant="outline" onClick={() => refetchQrcodes()}>
                {t.retry}
              </Button>
            }
          />
        ) : itemQrcode.length === 0 ? (
          <QrEmptyState
            icon={QrCode}
            title={t.emptyTitle}
            body={t.emptyBody}
            action={
              <Button asChild>
                <Link to="/dashboard/qrcode-generator">{t.emptyCta}</Link>
              </Button>
            }
          />
        ) : (
          <>
            <QrList>
              {itemQrcode.map((item, index) => (
                <CardQrcode {...item} index={index} key={item.id} onDeleted={handleDeleted} />
              ))}
            </QrList>
            <CreateQrcode />
          </>
        )}
      </section>
    </div>
  );
}

export { Dashboard };
