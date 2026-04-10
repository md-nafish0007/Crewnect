import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { InboxManager } from "./inbox-manager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MessagesPage() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/");

  const userId = session.userId as string;

  // Retrieve all ACCEPTED friend requests where the logged in user is either sender or receiver
  const friendships = await prisma.friendRequest.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
      status: "ACCEPTED",
    },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true } },
      receiver: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  const friends = friendships.map(f => {
    return f.senderId === userId ? f.receiver : f.sender;
  });

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <ThemeToggle />
      
      <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 shadow-sm z-10 flex items-center gap-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Direct Messages</h1>
      </header>

      <main className="flex-1 min-h-0 relative">
        <InboxManager friends={friends} currentUserId={userId} />
      </main>
    </div>
  );
}
