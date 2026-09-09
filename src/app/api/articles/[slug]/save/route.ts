import { NextResponse } from "next/server";
import { db as prisma } from "../../../../../lib/db";
import { auth } from "../../../../../lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ saved: false });
    }

    const { slug } = await params;
    const userId = session.user.id;

    if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      return NextResponse.json({ saved: false });
    }

    const savedRecord = await prisma.savedArticle.findUnique({
      where: {
        articleId_userId: {
          articleId: slug,
          userId,
        },
      },
    });

    return NextResponse.json({ saved: !!savedRecord });
  } catch (error) {
    console.error("Error checking saved article:", error);
    return NextResponse.json({ saved: false });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const userId = session.user.id;

    if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      return NextResponse.json({ saved: true, message: "Demo mode: saved state toggled" });
    }

    const existingRecord = await prisma.savedArticle.findUnique({
      where: {
        articleId_userId: {
          articleId: slug,
          userId,
        },
      },
    });

    if (existingRecord) {
      await prisma.savedArticle.delete({
        where: { id: existingRecord.id },
      });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedArticle.create({
        data: {
          articleId: slug,
          userId,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Error toggling saved article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
