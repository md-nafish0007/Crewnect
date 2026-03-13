"use client";

import { useState } from "react";
import { User, Users } from "lucide-react";

export type Student = {
  id: string;
  name: string;
  major: string | null;
  bio: string | null;
  gender: string | null;
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
          students.map((student, i) => (
            <div
              key={student.id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 group"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-4 mb-4">
                {/* Generic Avatar based on Gender */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 transition-colors ${
                    student.gender === "Female"
                      ? "bg-pink-50 text-pink-500 border-pink-100 dark:bg-pink-900/30 dark:border-pink-800"
                      : "bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800"
                  }`}
                >
                  <User size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded-md">
                      {student.gender || "Unknown"}
                    </p>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 font-mono py-0.5 rounded-md">
                      {student.major || "Undeclared"}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-4 line-clamp-2">
                {student.bio || "No bio provided yet."}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
