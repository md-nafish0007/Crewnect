"use client";

import { User, Users, Code2 } from "lucide-react";

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
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Registered Students Directory
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse and discover students. Showing {students.length} profiles.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <Users size={48} className="mb-4 opacity-20" />
            <p>No students found.</p>
          </div>
        ) : (
          students.map((student, i) => {
            const stacks = student.techStacks ? student.techStacks.split(",").filter(Boolean) : [];

            return (
              <div
                key={student.id}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-start gap-4 mb-4">
                  {/* Generic Avatar based on Gender */}
                  <div
                    className={`w-14 h-14 rounded-full shrink-0 flex items-center justify-center shadow-inner overflow-hidden border-2 transition-colors ${
                      student.gender === "Female"
                        ? "bg-pink-50 text-pink-500 border-pink-100 dark:bg-pink-900/30 dark:border-pink-800"
                        : "bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800"
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
                        <p className="text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-full">
                          {student.year}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {student.gender || "Unknown"}
                      </p>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        {student.major || "Undeclared"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech Stacks Container */}
                {stacks.length > 0 && (
                  <div className="mt-2 mb-4">
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <Code2 size={12} /> Tech Interests
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {stacks.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full border bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* About Section */}
                <div className="mt-auto">
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-4 line-clamp-3">
                    <span className="font-semibold block text-xs mb-1 text-gray-900 dark:text-gray-300">About Me:</span>
                    {student.bio || "No about provided yet."}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
