import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { Resend } from "resend";

const resend = new Resend("re_cy8RPdQg_NNfYxrcTnRxGsDLt3sv8PbMR");

const MAX_TIME = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1;

export async function POST(req: Request) {
  try {
    const { email, password, confirmPassword } = await req.json();

    if (!password || password.length < 8) {
      return new NextResponse(
        "La contraseña debe tener al menos 8 caracteres",
        { status: 401 }
      );
    }

    if (!email || !confirmPassword) {
      return new NextResponse("Todos los campos son requeridos", {
        status: 401,
      });
    }

    if (password !== confirmPassword) {
      return new NextResponse("La contraseña no coincide", {
        status: 400,
      });
    }

    const userFound = await db.user.findUnique({ where: { email: email } });

    if (userFound) {
      return new NextResponse("El correo ya esta registrado", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const secret = process.env.JWT_SECRET || "";

    const token = jwt.sign(
      {
        email,
        password,
        confirmPassword,
      },
      secret,
      {
        expiresIn: MAX_TIME,
      }
    );

    const token2 = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      secret,
      {
        expiresIn: MAX_TIME,
      }
    );

    const forgetUrl = `https://lms-front-xi.vercel.app/change-password?token=${token2}`;

    // @ts-ignore
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Cambio de Contraseña",
      html: `<a href=${forgetUrl}>Cambiar contraseña<a>`,
    });

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
      message: "Authenticated",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Set-Cookie": serialized },
    });

    // NextResponse.next({
    //   request: {
    //     // New request headers
    //     headers: newHeaders,
    //   },
    // });

    // return NextResponse.json(user);
  } catch (error) {
    console.log("[AUTH/SIGNUP]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
