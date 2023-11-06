import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { user, values } = await req.json();
    const { courseId } = params;

    const userFound = await db.user.findUnique({
      where: { email: user?.email },
    });

    let userId: string = "";

    if (userFound) {
      userId = userFound.id;
      if (!userId) {
        return new NextResponse("Usuario no autorizado", { status: 401 });
      }
    }

    const course = await db.course.update({
      where: { id: courseId, userId },
      data: { ...values },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
