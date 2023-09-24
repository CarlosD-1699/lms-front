import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("myToken")?.value;

  if (!cookie) {
    return new NextResponse("Token no encontrado", { status: 401 });
  }

  const secret = process.env.JWT_SECRET || "";

  try {
    verify(cookie, secret);

    const nulo = "";

    const serialized = serialize("myToken", nulo, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    const response = {
      message: "Authenticated",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Set-Cookie": serialized },
    });
  } catch (error) {
    console.log("[AUTH/LOGOUT]", error);
    return new NextResponse("Invalid Token", { status: 401 });
  }
}
