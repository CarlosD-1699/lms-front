import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user, params } = await req.json();
  console.log(user, params);
  try {
    const userFound = await db.user.findUnique({
      where: { email: user?.email },
    });

    let userId: string = "";

    if (userFound) {
      userId = userFound.id;
      if (!userId) {
        return { redirect: { destination: "/" } };
      }
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId },
    });

    if (!course) {
      return { redirect: { destination: "/" } };
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
