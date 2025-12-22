import { NextRequest, NextResponse } from "next/server";

export function middleware (req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const { pathname } = req.nextUrl;
    console.log(req);

    const publicRoutes = ["/login", "/register"];

    if(publicRoutes.includes(pathname)){
        if(token) {
            return NextResponse.redirect(new URL("/canvas/1", req.url));
        }
        return NextResponse.next();
    }

    if(!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    "/login"
  ]
};
