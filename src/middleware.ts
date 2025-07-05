// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname); // add to request headers
  return response;
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // run on all routes
};
