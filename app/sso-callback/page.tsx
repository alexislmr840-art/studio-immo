"use client";
import { Suspense } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

function Callback() {
  return (
    <AuthenticateWithRedirectCallback
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    />
  );
}

export default function SSOCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-blue-950" />}>
      <Callback />
    </Suspense>
  );
}