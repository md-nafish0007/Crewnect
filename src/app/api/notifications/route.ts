import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || !session.userId) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const friendCount = await prisma.friendRequest.count({
      where: {
        receiverId: session.userId as string,
        status: "PENDING"
      }
    });

    const dmCount = await prisma.directMessage.count({
      where: {
        receiverId: session.userId as string,
        read: false
      }
    });

    return NextResponse.json({ count: friendCount + dmCount });
  } catch (err) {
    console.error("Failed to fetch pending requests:", err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
