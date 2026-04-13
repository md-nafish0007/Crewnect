import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || !session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const targetId = url.searchParams.get("targetId");
  if (!targetId) return NextResponse.json({ error: "Missing targetId" }, { status: 400 });

  try {
    // Verify connection (ACCEPTED or PENDING_RECEIVED)
    const friendship = await prisma.friendRequest.findFirst({
        where: {
            OR: [
              { senderId: session.userId as string, receiverId: targetId },
              { senderId: targetId, receiverId: session.userId as string }
            ],
            // We allow fetching DMs for pending requests if they are received, 
            // though usually there are none. We only block truly unrelated users.
            status: { in: ["ACCEPTED", "PENDING"] }
        }
    });

    if (!friendship) return NextResponse.json({ error: "Not friends" }, { status: 403 });

    // Mark messages as read when fetched by receiver
    await prisma.directMessage.updateMany({
      where: {
        senderId: targetId,
        receiverId: session.userId as string,
        read: false
      },
      data: { read: true }
    });

    const messages = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: session.userId as string, receiverId: targetId },
          { senderId: targetId, receiverId: session.userId as string }
        ]
      },
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(messages, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { targetId, text } = await req.json();
  if (!targetId || !text) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  try {
    const saved = await prisma.directMessage.create({
      data: { senderId: session.userId as string, receiverId: targetId, text }
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}
