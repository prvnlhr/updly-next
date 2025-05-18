import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const response = NextResponse.next();

  // Skip static files and API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return response;
  }

  // Get session
  const session = await auth();
  const isAuthenticated = !!session?.user;

  // Protected routes
  const protectedRoutes = [
    "/home/feed",
    /^\/home\/r\/[^\/]+\/submit$/, // Regex for /home/r/{communityName}/submit
  ];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (typeof route === "string") {
      return pathname.startsWith(route);
    }
    return route.test(pathname);
  });

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    // Special case for create-community
    if (
      pathname === "/home/feed" &&
      searchParams.get("create-community") === "true"
    ) {
      return NextResponse.redirect(new URL("/home/feed", request.url));
    }

    // For submit routes
    if (/^\/home\/r\/[^\/]+\/submit$/.test(pathname)) {
      return NextResponse.redirect(new URL("/home/feed", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
