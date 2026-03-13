import prisma from "@/lib/prisma";
import { ChatBox } from "@/components/chat-box";
import { Directory } from "@/components/directory";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegisterModal } from "@/components/register-modal";

async function ensureMockData() {
  const count = await prisma.student.count();
  if (count === 0) {
    await prisma.student.createMany({
      data: [
        { name: "User 1", email: "001@delhitechnicalcampus.ac.in", major: "Computer Science", gender: "Male", bio: "Looking for hackathon teammates!" },
        { name: "User 2", email: "002@delhitechnicalcampus.ac.in", major: "Mechanical Engineering", gender: "Female", bio: "Robotics club enthusiast. Open to collaborations on hardware." },
        { name: "User 3", email: "003@delhitechnicalcampus.ac.in", major: "Design", gender: "Female", bio: "UI/UX designer looking to build cool web apps." },
        { name: "User 4", email: "004@delhitechnicalcampus.ac.in", major: "Data Science", gender: "Male", bio: "AI is the future. Currently exploring localized LLMs." },
        { name: "User 5", email: "005@delhitechnicalcampus.ac.in", major: "Business", gender: "Male", bio: "Aspiring entrepreneur. Looking for technical co-founders." },
        { name: "User 6", email: "006@delhitechnicalcampus.ac.in", major: "Biology", gender: "Female", bio: "Bioinformatics research. I love analyzing huge datasets." },
      ]
    });
  }
}

export default async function Home() {
  await ensureMockData();
  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 pb-20 transition-colors duration-300">
      
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Hero Section */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 relative">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-in slide-in-from-bottom-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
            </span>
            Crewnect Ultra-Simplified Standard App
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white animate-in slide-in-from-bottom-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Perfect Crew</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 animate-in slide-in-from-bottom-5">
            Discover fellow registered students categorized by gender, and jump into the global chat to connect instantly.
          </p>
          <div className="flex justify-center">
            <RegisterModal />
          </div>
        </div>
      </header>

      {/* Directory Section */}
      <Directory students={students} />

      {/* Floating Chat Component */}
      <ChatBox />
    </div>
  );
}
