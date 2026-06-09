import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/connexion(.*)",
  "/inscription(.*)",
  "/sso-callback(.*)",
  "/tarifs",
  "/api/stripe/webhook",
  "/mentions-legales(.*)",
  "/cgu(.*)",
  "/cgv(.*)",
  "/confidentialite(.*)",
]);

const isAuthRoute = createRouteMatcher(["/connexion(.*)", "/inscription(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};