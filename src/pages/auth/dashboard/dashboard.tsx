import React from "react";
import { ArrowRight, QrCode } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardQrcode,
  CardTitle,
  CreateQrcode,
  Toaster,
  Skeleton,
} from "@/components";

import { useGetQrcodes,  useLang, useUserGetMe } from "@/hooks";
import { Link } from "react-router-dom";
import { images } from "@/assets";
import { getImageUrl } from "@/config";
function Dashboard() {
 
  const { data, isLoading } = useGetQrcodes();
  const { translations } = useLang();
  useUserGetMe();
  const t = translations.pages.dashboard



  const totalQrcodes = Array.isArray(data) ? data.length : 0;
  const itemQrcode = Array.isArray(data)
    ? [...data]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          title: item.title || t.noTitle,
          link: item.targetUrl?.replace(/^https?:\/\//, "") || t.noLink,
          date: item.createdAt,
          scans: 0,
          image: getImageUrl(item.imageUrl) || images.qrCode.qr_code1,
        }))
    : [];



  return (
    <React.Fragment>
      <div className="md:pb-0 pb-16 space-y-8">
        <Toaster richColors />

        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.totalQrcodes }</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{totalQrcodes}</span>
                <QrCode size={30} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold block">{ t.myQrcodes}</span>
            <Link
              to="/dashboard/my-qrcodes"
              className="duration-300 hover:text-muted flex items-center gap-2">
              <span className="text-sm">{ t.viewAll}</span>
              <ArrowRight size={18} />
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
              {itemQrcode.map((item, index) => (
                <CardQrcode {...item} key={index} />
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
