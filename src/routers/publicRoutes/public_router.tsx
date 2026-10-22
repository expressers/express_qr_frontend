import React, { lazy, Suspense } from "react";
import {
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  Verifyaccount,
  VerifyEmail,
  Subscriber,
  About,
  Construction,
  Redirect
} from "@/pages";
import { Route } from "react-router-dom";
import { AppLayoutPublic } from "@/Layout";

const Home = lazy(() => import("@/pages/public/home/home").then(m => ({ default: m.Home })));

function Loading() {
  return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>A carregar…</div>;
}

function PublicRouter() {
  return (
    <React.Fragment>
      <Route element={<AppLayoutPublic />}>
        <Route path="/" element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/forgotpassword" element={<ForgotPassword />} />
        {/* O link do email aponta para /reset-password?token=...; o caminho antigo fica como alias. */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/resetPassword" element={<ResetPassword />} />
        <Route path="/subscriber" element={<Subscriber />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="/auth/verify-account" element={<Verifyaccount />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/r/:slug" element={<Redirect />} />
      <Route path="/construction" element={<Construction/>} />
    </React.Fragment>
  );
}

export { PublicRouter };
