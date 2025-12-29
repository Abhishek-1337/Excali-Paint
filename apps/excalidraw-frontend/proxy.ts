import { NextRequest, NextResponse } from "next/server";

export default function proxy (req: NextRequest) {
    const token = req.cookies.get("refreshToken")?.value;
    const { pathname } = req.nextUrl;
    console.log("chlra hai kya");

    const publicRoutes = ["/login", "/register"];

    const isPublicRoute = publicRoutes.some(route =>
      pathname.startsWith(route)
    );

    if (isPublicRoute && token) {
      return NextResponse.redirect(new URL("/canvas/1", req.url));
    }

    if (!isPublicRoute && !token) {
      console.log("fuck");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api).*)"
  ]
};
