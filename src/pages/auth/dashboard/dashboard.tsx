import React from "react";
import { ArrowRight, QrCode } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardQrcode,
  CardTitle,
  CreateQrcode,
  Skeleton,
} from "@/components";

import { useGetMeplan, useGetQrcodes, useLang, useUserGetMe } from "@/hooks";
import { Link } from "react-router-dom";
import { images } from "@/assets";
import { getImageUrl } from "@/config";
import { PlanUsageCard } from "@/components/createQrcode";

function Dashboard() {
  const { data, total, isLoading, refetchQrcodes } = useGetQrcodes();
  const { data: myPlan, isLoading: isLoadingPlan, refetch: refetchPlan } = useGetMeplan();
  const { translations } = useLang();
  useUserGetMe();
  const t = translations.pages.dashboard;

  const itemQrcode = (data ?? []).slice(0, 5).map((item) => ({
    id: item.id,
    title: item.title || t.noTitle,
    link:
      (item.targetUrl ?? item.staticContent)?.replace(/^https?:\/\//, "") ||
      t.noLink,
    date: item.createdAt,
    scans: item.scanCount ?? 0,
    isActive: item.isActive,
    image: getImageUrl(item.imageUrl ?? undefined) || images.qrCode.qr_code1,
  }));

  const handleDeleted = () => {
    refetchQrcodes();
    refetchPlan();
  };

  return (
    <React.Fragment>
      <div className="md:pb-0 pb-16 space-y-8">

        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.totalQrcodes}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{total}</span>
                <QrCode size={30} aria-hidden />
              </div>
            </CardContent>
          </Card>
          <PlanUsageCard
            myPlan={myPlan}
            isLoading={isLoadingPlan}
            type="STATIC"
            title={t.staticUsage}
          />
          <PlanUsageCard
            myPlan={myPlan}
            isLoading={isLoadingPlan}
            type="DYNAMIC"
            title={t.dynamicUsage}
          />
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold block">{t.myQrcodes}</span>
            <Link
              to="/dashboard/my-qrcodes"
              className="duration-300 hover:text-muted-foreground flex items-center gap-2">
              <span className="text-sm">{t.viewAll}</span>
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 sm:gap-8 gap-4 custom-cols-2 custom-cols-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:gap-8 gap-4 custom-cols-2 custom-cols-1">
              {itemQrcode.map((item) => (
                <CardQrcode {...item} key={item.id} onDeleted={handleDeleted} />
              ))}
              <CreateQrcode />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export { Dashboard };
