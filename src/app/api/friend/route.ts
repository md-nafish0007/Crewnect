import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { targetId } = await req.json();
  if (!targetId || targetId === session.userId) return NextResponse.json({ error: "Invalid target" }, { status: 400 });

  try {
    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: session.userId as string, receiverId: targetId },
          { senderId: targetId, receiverId: session.userId as string }
        ]
      }
    });

    if (existing) {
       // If it exists and was rejected, we could technically update it back to pending, but for simplicity we return exists
       if (existing.status !== "REJECTED") {
          return NextResponse.json({ error: "Request exists" }, { status: 400 });
       }
       const reqRecord = await prisma.friendRequest.update({
         where: { id: existing.id },
         data: { status: "PENDING", senderId: session.userId as string, receiverId: targetId }
       });
       return NextResponse.json(reqRecord, { status: 200 });
    }

    const reqRecord = await prisma.friendRequest.create({
      data: { senderId: session.userId as string, receiverId: targetId }
    });
    return NextResponse.json(reqRecord, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || !session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { requestId, action } = await req.json();
  if (!requestId || (action !== "ACCEPT" && action !== "REJECT")) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  try {
    const friendReq = await prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!friendReq || friendReq.receiverId !== session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    if (action === "REJECT") {
       await prisma.friendRequest.delete({ where: { id: requestId } });
       return NextResponse.json({ success: true }, { status: 200 });
    }

    const updated = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" }
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || !session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { targetId } = await req.json();
  if (!targetId) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  try {
    // Delete any relationship (PENDING or ACCEPTED) between these two users
    const friendReq = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: session.userId as string, receiverId: targetId },
          { senderId: targetId, receiverId: session.userId as string }
        ]
      }
    });

    if (!friendReq) return NextResponse.json({ error: "No connection found" }, { status: 404 });

    await prisma.friendRequest.delete({
      where: { id: friendReq.id }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
