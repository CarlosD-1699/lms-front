import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { jwtVerify } from "jose";

const f = createUploadthing();

const handleAuth = async (req: NextRequest) => {
  const { user } = await req.json();
  const jwt = req.cookies.get("myToken")?.value;

  const userFound = await db.user.findUnique({
    where: { email: user?.email },
  });

  console.log(user, userFound);

  let userId: string = "";

  if (userFound) {
    userId = userFound?.id || "";
    if (!userId) throw new Error("Usuario no autorizado");
  }

  return { userId };
  // return NextResponse.json({ userId });
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => handleAuth(req))
    .onUploadComplete(() => {}),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async ({ req }) => handleAuth(req))
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(async ({ req }) => handleAuth(req))
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
