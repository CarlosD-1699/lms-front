import { useAuth } from "@/app/_context/auth-context";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { values, userEmail } = await req.json();
  console.log(userEmail);
  const title = values.title;
  try {
    if (!userEmail || userEmail == undefined) {
      console.log(userEmail);
      return new NextResponse("valor de userEmail indefinido", { status: 400 });
    }

    const userFound = await db.user.findUnique({ where: { email: userEmail } });

    if (!userFound) {
      return new NextResponse("Usuario no encontrado", { status: 400 });
    }

    const userId = userFound.id;

    if (!userId) {
      return new NextResponse("Usuario no autorizado", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
