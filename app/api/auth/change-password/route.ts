import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface BodyProps {
  newPassword: string;
  confirmPassword: string;
}

export async function POST(req: Request) {
  try {
    const body: BodyProps = await req.json();
    const { newPassword, confirmPassword } = body;

    //Validamos que se envien todos los campos

    if (!newPassword || !confirmPassword) {
      return new NextResponse("Todos los campos son requeridos", {
        status: 400,
      });
    }

    const headerList = headers();
    const token = headerList.get("token");

    const secret = process.env.JWT_SECRET || "";

    // Verificar que haya token
    if (!token) {
      return new NextResponse("No autorizado", {
        status: 400,
      });
    }

    try {
      const isTokenValid = jwt.verify(token, secret);

      // @ts-ignore
      const { userId } = isTokenValid;

      const userFound = await db.user.findUnique({ where: { id: userId } });

      //Validamos que exista el usuario por el correo
      if (!userFound) {
        return new NextResponse("Usuario no encontrado", { status: 400 });
      }

      //Validamos que las contraseñas coincidan
      if (newPassword !== confirmPassword) {
        return new NextResponse("Las contraseñas deben coincidir", {
          status: 400,
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      userFound.password = hashedPassword;

      const updateUser = await db.user.update({
        where: {
          email: userFound.email,
        },
        data: {
          password: userFound.password,
        },
      });

      return NextResponse.json("Se cambio la contraseña correctamente", {
        status: 200,
      });
    } catch (error) {
      const isTokenValid = jwt.verify(token, secret);
      // @ts-ignore
      const { data } = isTokenValid;
      return new NextResponse(`Token no es valido ${secret}`, {
        status: 400,
      });
    }
  } catch (error) {
    console.log("[AUTH/CHANGE-PASSWORD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
