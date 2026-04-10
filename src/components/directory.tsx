"use client";

import { User, Users, Code2, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export type Student = {
  id: string;
  name: string;
  major: string | null;
  bio: string | null;
  gender: string | null;
  year: string | null;
  techStacks: string | null;
};

export function Directory({ students }: { students: Student[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(student => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const techStr = student.techStacks?.toLowerCase() || "";
    const nameStr = student.name.toLowerCase();
    
    return techStr.includes(query) || nameStr.includes(query);
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-12" id="directory">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Registered Students Directory
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse and discover students. Showing {filteredStudents.length} profiles.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by tech stack (e.g. React) or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-dashed border-gray-300 dark:border-gray-800"
          >
            <Search size={48} className="mb-4 opacity-20" />
            <p>No students match that tech stack.</p>
          </motion.div>
        ) : (
          filteredStudents.map((student, i) => {
            const stacks = student.techStacks ? student.techStacks.split(",").filter(Boolean) : [];
            // Using motion on standard div, inside a Link for stability instead of raw motion(Link)
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                className="h-full flex flex-col"
              >
                <Link
                  href={`/profile/${student.id}`}
                  className="flex-1 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-white/60 dark:border-white/5 rounded-3xl p-6 shadow-lg shadow-gray-200/40 dark:shadow-black/40 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-white/90 dark:hover:bg-gray-900/60 transition-all duration-300 group flex flex-col cursor-pointer overflow-hidden relative"
                >
                  {/* Subtle Gradient Glow in Dark Mode Only */}
                  <div className="absolute -inset-10 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/5 dark:to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0 pointer-events-none"></div>

                  <div className="flex items-start gap-4 mb-4 relative z-10">
                    <div
                      className={`w-14 h-14 rounded-full shrink-0 flex items-center justify-center shadow-inner overflow-hidden border-2 transition-colors ${
                        student.gender === "Female"
                          ? "bg-pink-50/80 text-pink-500 border-pink-100/50 dark:bg-pink-900/20 dark:border-pink-800/30"
                          : "bg-blue-50/80 text-blue-500 border-blue-100/50 dark:bg-blue-900/20 dark:border-blue-800/30"
                      }`}
                    >
                      <User size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {student.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {student.year && (
                          <p className="text-xs font-semibold text-purple-600 bg-purple-50/80 dark:bg-purple-900/20 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-800/30">
                            {student.year}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-gray-500 bg-gray-100/80 dark:bg-gray-800/50 dark:text-gray-400 px-2 py-0.5 rounded-full border border-gray-200/50 dark:border-gray-700/30">
                          {student.gender || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {stacks.length > 0 && (
                    <div className="mt-2 mb-4 relative z-10 border-t border-gray-100/50 dark:border-gray-800/50 pt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {stacks.map((tech, idx) => (
                          <span 
                            key={idx} 
                            className="text-[11px] font-medium px-2.5 py-1 rounded-md border bg-white/50 border-gray-200/50 text-gray-600 dark:bg-gray-800/50 dark:border-gray-700/50 dark:text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto relative z-10">
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-3">
                      {student.bio || "Available in directory."}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </main>
  );
}
