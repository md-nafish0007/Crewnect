import Link from "next/link";
import prisma from "@/lib/prisma";
import { ChatBox } from "@/components/chat-box";
import { Directory } from "@/components/directory";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegisterModal } from "@/components/register-modal";
import { LoginModal } from "@/components/login-modal";
import { UserProfile } from "@/components/user-profile";
import { getSession } from "@/lib/auth";
import { InboxButton } from "@/components/inbox-button";

export default async function Home() {
  const session = await getSession();
  let currentUser = null;
  if (session && session.userId) {
    // using Prisma in server component
    const userResult = await prisma.student.findUnique({
      where: { id: session.userId as string },
      select: { id: true, name: true, email: true }
    });
    if (userResult) currentUser = userResult;
  }

  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 pb-20 transition-colors duration-300">
      
      {/* Top Right Controls */}
      <ThemeToggle />
      {currentUser && <InboxButton />}

      {/* Hero Section */}
      <header className="relative bg-transparent overflow-hidden pb-16 pt-24 md:pt-32 transition-colors duration-500">
        {/* Subtle Glassmorphic Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-purple-500/10 dark:bg-purple-900/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
            </span>
            Crewnect Ultra-Simplified Standard App
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both" style={{ animationDelay: '100ms' }}>
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Perfect Crew</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500/90 dark:text-gray-400/90 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 font-medium fill-mode-both" style={{ animationDelay: '200ms' }}>
            Discover fellow registered students categorized by gender, and jump into the global chat to connect instantly.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both" style={{ animationDelay: '300ms' }}>
            {currentUser ? (
              <UserProfile user={currentUser} />
            ) : (
              <>
                <LoginModal />
                <RegisterModal />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Directory Section */}
      <Directory students={students} />

      {/* Floating Chat Component */}
      <ChatBox currentUser={currentUser} />
    </div>
  );
}
