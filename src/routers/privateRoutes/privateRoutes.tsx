import React from "react";
import { Route } from "react-router-dom";
import {
  Dashboard,
  Settings,
  UpdatePassword,
  MyQrcodes,
  QrcodeGenerator,
  Subscription,
  QrcodeEdit,
} from "@/pages";
import { AppLayoutPrivate, Profilelayaout } from "@/Layout";
import { Skeleton, LazyBoundary } from "@/components";
import { ProtectedRoutes } from "@/guards";

// Estatísticas em chunk próprio: o recharts sai do bundle principal.
const Statistic = React.lazy(() =>
  import("@/pages/auth/statistic").then((m) => ({ default: m.Statistic })),
);

function StatisticFallback() {
  return (
    <div className="space-y-6 pt-8" aria-busy="true">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

function PrivateRoute() {
  return (
    <React.Fragment>
      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayoutPrivate />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<Profilelayaout />}>
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route
              path="/dashboard/profile/updatepassword"
              element={<UpdatePassword />}
            />
          </Route>
          <Route path="/dashboard/my-qrcodes" element={<MyQrcodes />} />
          <Route
            path="/dashboard/qrcode-generator"
            element={<QrcodeGenerator />}
          />
          <Route path="/dashboard/qrcode-edit/:id" element={<QrcodeEdit />} />
          <Route path="/dashboard/subscription" element={<Subscription />} />
          <Route path="/dashboard/statistic" element={
              <LazyBoundary>
                <React.Suspense fallback={<StatisticFallback />}>
                  <Statistic />
                </React.Suspense>
              </LazyBoundary>
            } />
        </Route>
      </Route>
    </React.Fragment>
  );
}

export { PrivateRoute };
