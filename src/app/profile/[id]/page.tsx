import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SocialButtons } from "./social-buttons";
import { User, Code2, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const loggedInUserId = session?.userId as string | undefined;

  const user = await prisma.student.findUnique({
    where: { id },
  });

  if (!user) {
    return notFound();
  }

  // Determine friendship status
  let friendStatus = "NONE"; // "NONE", "PENDING_SENT", "PENDING_RECEIVED", "ACCEPTED"
  let requestId = null;

  if (loggedInUserId && loggedInUserId !== user.id) {
    const request = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: loggedInUserId, receiverId: user.id },
          { senderId: user.id, receiverId: loggedInUserId },
        ],
      },
    });

    if (request) {
      requestId = request.id;
      if (request.status === "ACCEPTED") friendStatus = "ACCEPTED";
      else if (request.status === "REJECTED") friendStatus = "NONE"; // Allow re-requesting potentially
      else if (request.senderId === loggedInUserId) friendStatus = "PENDING_SENT";
      else friendStatus = "PENDING_RECEIVED";
    }
  }

  const isSelf = loggedInUserId === user.id;
  const stacks = user.techStacks ? user.techStacks.split(",").filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <ThemeToggle />
      
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Directory
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Avatar */}
            <div
              className={`w-32 h-32 rounded-full shrink-0 flex items-center justify-center shadow-inner overflow-hidden border-4 transition-colors ${
                user.gender === "Female"
                  ? "bg-pink-50 text-pink-500 border-pink-100 dark:bg-pink-900/30 dark:border-pink-800"
                  : "bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800"
              }`}
            >
              <User size={64} strokeWidth={2} />
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white">
                {user.name}
              </h1>
              
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-6">
                {user.year && (
                  <p className="text-sm font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full">
                    {user.year}
                  </p>
                )}
                <p className="text-sm font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-3 py-1 rounded-full">
                  {user.gender || "Unknown"}
                </p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {user.major || "Undeclared"}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">About</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {user.bio || "This user hasn't added a bio yet."}
                </p>
              </div>

              {stacks.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-center md:justify-start gap-1.5 mb-3 text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <Code2 size={16} /> Tech Interests
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {stacks.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs font-medium px-3 py-1.5 rounded-full border bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-4">
                <SocialButtons 
                  targetUserId={user.id} 
                  initialStatus={friendStatus} 
                  requestId={requestId}
                  isSelf={isSelf} 
                  isLoggedIn={!!loggedInUserId} 
                />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
