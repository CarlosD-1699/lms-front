import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import jwt from "jsonwebtoken";

const resend = new Resend("re_cy8RPdQg_NNfYxrcTnRxGsDLt3sv8PbMR");

const MAX_TIME = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const userFound = await db.user.findUnique({ where: { email: email } });

    //Validar que exista el usuario
    if (!userFound) {
      return new NextResponse("Usuario no encontrado", { status: 400 });
    }

    // const tokenData = {
    //   email: userFound.email,
    //   userId: userFound.id,
    // };

    const secret = process.env.JWT_SECRET || "";

    const token = jwt.sign(
      {
        // data: tokenData,
        email: userFound.email,
        userId: userFound.id,
      },
      secret,
      {
        expiresIn: MAX_TIME,
      }
    );

    const forgetUrl = `https://lms-front-xi.vercel.app/change-password?token=${token}`;

    // @ts-ignore
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Cambio de Contraseña",
      html: `<a href=${forgetUrl}>Cambiar contraseña<a>`,
    });

    return NextResponse.json("Correo enviado exitosamente", { status: 200 });
  } catch (error) {
    console.log("[AUTH/FORGET-PASSWORD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
