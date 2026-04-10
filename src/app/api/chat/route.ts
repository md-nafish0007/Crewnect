import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch the 50 most recent messages
export async function GET() {
  try {
    const recentMessages = await prisma.globalMessage.findMany({
      take: 50,
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(recentMessages, { status: 200 });
  } catch (err: any) {
    console.error("Chat GET Error:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// Save a new message and garbage collect old ones
export async function POST(req: Request) {
  try {
    const { text, user } = await req.json();

    if (!text || !user) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save exactly as presented
    const savedMsg = await prisma.globalMessage.create({
      data: { text, user },
    });

    // Free space mechanic: Delete all messages except the 50 most recent
    const messagesCount = await prisma.globalMessage.count();
    if (messagesCount > 50) {
      const oldestMessages = await prisma.globalMessage.findMany({
        orderBy: { createdAt: "asc" },
        take: messagesCount - 50,
        select: { id: true },
      });
      await prisma.globalMessage.deleteMany({
        where: { id: { in: oldestMessages.map((m) => m.id) } },
      });
    }

    return NextResponse.json(savedMsg, { status: 201 });
  } catch (err: any) {
    console.error("Chat POST Error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
