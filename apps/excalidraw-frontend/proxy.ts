import { NextRequest, NextResponse } from "next/server";

export default function proxy (req: NextRequest) {
    const token = req.cookies.get("refresh_token")?.value;
    const { pathname } = req.nextUrl;

    console.log(pathname);

    const publicRoutes = ["/login", "/register", "/forget-password", "/reset-password"];

    if(pathname === "/") return NextResponse.next();
    const isPublicRoute = publicRoutes.some(route =>
      pathname.startsWith(route)
    );

    if (isPublicRoute && token) {
      return NextResponse.redirect(new URL("/canvas", req.url));
    }

    if (!isPublicRoute && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api).*)"
  ]
};
