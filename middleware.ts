import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/opd", "/admissions", "/pharmacy", "/patients", "/billing", "/analytics", "/clinical", "/onboarding"];
const publicRoutes = ["/", "/signup", "/login", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sb-saiboreailvjmxxpeteu-auth-token")?.value ||
                request.cookies.get("sb-access-token")?.value;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublic = publicRoutes.some(route => pathname === route);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((pathname === "/login" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|og-image.svg).*)"],
};
