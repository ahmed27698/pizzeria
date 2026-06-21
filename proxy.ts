import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/register", "/menu", "/api/auth"];
const adminPaths = ["/admin"];

export default auth((req) => {
  const { nextUrl, auth: session } = req as any;
  const isLoggedIn = !!session;
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const path = nextUrl.pathname;

  const isPublic = publicPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );
  const isAdminPath = adminPaths.some((p) => path.startsWith(p));
  const isApiPath = path.startsWith("/api/");

  if (isApiPath) return NextResponse.next();

  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
