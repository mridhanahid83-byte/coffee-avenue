import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/setup"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isLoggedIn = !!req.auth?.user;

  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  if (
    isLoggedIn &&
    req.auth?.user?.mustChangePassword &&
    !pathname.startsWith("/settings/profile") &&
    !pathname.startsWith("/api")
  ) {
    return NextResponse.redirect(new URL("/settings/profile?forceChange=1", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
