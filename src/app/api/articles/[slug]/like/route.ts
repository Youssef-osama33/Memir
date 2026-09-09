import { NextResponse } from "next/server";
import { db as prisma } from "../../../../../lib/db";
import { auth } from "../../../../../lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      return NextResponse.json({ liked: true, message: "Demo mode: like registered in session" });
    }

    const { slug } = await params;
    const userId = session.user.id;

    const existingLike = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId: slug,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.articleLike.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.articleLike.create({
        data: {
          articleId: slug,
          userId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
