import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const MAX_TIME = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    //Validamos que se envien todos los campos

    if (!email || !password) {
      return new NextResponse("Todos los campos son requeridos", {
        status: 400,
      });
    }

    const userFound = await db.user.findUnique({ where: { email: email } });

    //Validampos que exista el usuario por el correo
    if (!userFound) {
      return new NextResponse("Usuario no encontrado", { status: 400 });
    }

    const isCorrect: Boolean = await bcrypt.compare(
      password,
      userFound.password
    );

    //Validamos que la contraseña sea la correcta
    if (!isCorrect) {
      return new NextResponse("Contraseña incorrecta", { status: 400 });
    }

    const secret = process.env.JWT_SECRET || "";

    const token = jwt.sign(
      {
        email,
        password,
      },
      secret, {
        expiresIn: MAX_TIME,
      }
    );

    const serialized = serialize("myToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 1,
      path: "/",
    });

    // const newHeaders = new Headers(req.headers);
    // newHeaders.set("Set-Cookie", serialized);

    const response = {
        message: 'Authenticated',
        email, 
        password
    }

    return new Response(JSON.stringify(response),{
        status: 200,
        headers: {'Set-Cookie': serialized}
    })

    // NextResponse.next({
    //   request: {
    //     // New request headers
    //     headers: newHeaders,
    //   },
    // });

    //return NextResponse.json(userFound);
  } catch (error) {
    console.log("[AUTH/SIGNIN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
