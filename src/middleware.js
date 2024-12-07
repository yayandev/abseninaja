import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/";

  const accessToken = request.cookies.get("accessToken")?.value || "";

  if (!isPublicPath && !accessToken) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/dashboard", "/data-absensi", "/create-link-absensi"],
};
