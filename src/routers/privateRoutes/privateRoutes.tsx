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
  Statistic,
} from "@/pages";
import { AppLayoutPrivate, Profilelayaout } from "@/Layout";
import { ProtectedRoutes } from "@/guards";

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
          <Route path="/dashboard/statistic" element={<Statistic />} />
        </Route>
      </Route>
    </React.Fragment>
  );
}

export { PrivateRoute };
