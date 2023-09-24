import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // const userId = ;
    const { title } = await req.json();

    // if(!userId){
    //     return new NextResponse("Unauthorized", {status: 401});
    // }

    // const course = await db.course.create({
    //     data:{
    //         userId,
    //         title,
    //     }
    // })
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
