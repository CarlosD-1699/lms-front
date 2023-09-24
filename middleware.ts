import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("myToken")?.value;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  if (request.nextUrl.pathname.includes("/dashboard")) {
    if (jwt == undefined) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    try {
      const { payload } = await jwtVerify(jwt, secret);
    } catch (error) {
      console.error(error);
    }
  }

  return NextResponse.next();
}
