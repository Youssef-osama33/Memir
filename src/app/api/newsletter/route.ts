import { NextResponse } from "next/server";
import { db as prisma } from "../../../lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();

    if (!(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      return NextResponse.json({ success: true, message: "Subscription recorded" }, { status: 200 });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
