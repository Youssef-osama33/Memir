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

    const { slug } = await params;
    const body = await request.json();
    
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      return NextResponse.json({
        id: "demo-" + Date.now(),
        articleId: slug,
        userId: session.user.id,
        content: body.content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          name: session.user.name || "مشترك",
          image: session.user.image || null,
        }
      }, { status: 201 });
    }

    const comment = await prisma.comment.create({
      data: {
        articleId: slug,
        userId: session.user.id,
        content: body.content.trim(),
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
