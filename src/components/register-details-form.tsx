"use client";

import { Loader2, Check } from "lucide-react";
import { Button } from "./ui/button";

const TECH_STACKS = [
  "Frontend", "Backend", "Fullstack", "React/Next", "AI/ML", 
  "Data Science", "UI/UX Design", "Cloud/AWS", "Cybersecurity", 
  "DevOps", "Mobile/App", "Game Design", "Blockchain"
];

export function RegisterDetailsForm({
  formData,
  setFormData,
  selectedTechs,
  toggleTech,
  handleSendOtp,
  loading,
  error
}: {
  formData: any;
  setFormData: any;
  selectedTechs: string[];
  toggleTech: (tech: string) => void;
  handleSendOtp: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <form onSubmit={handleSendOtp} className="p-6 overflow-y-auto space-y-6 flex-1">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">Full Name *</label>
          <input 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">College Email *</label>
          <input 
            required 
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
            placeholder="@delhitechnicalcampus.ac.in"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">Password *</label>
        <input 
          required 
          type="password"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
          placeholder="Choose a strong password"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">Gender *</label>
          <select 
            value={formData.gender}
            onChange={e => setFormData({...formData, gender: e.target.value})}
            className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">Program / Major *</label>
          <select 
            value={formData.major}
            onChange={e => setFormData({...formData, major: e.target.value})}
            className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
          >
            <option value="B.Tech">B.Tech</option>
            <option value="BCA">BCA</option>
            <option value="M.Tech">M.Tech</option>
            <option value="MBA">MBA</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      {/* Year Toggle */}
      <div>
        <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Year of Study *</label>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl gap-1">
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => (
            <button
              key={y}
              type="button"
              onClick={() => setFormData({...formData, year: y})}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                formData.year === y 
                  ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 dark:text-blue-400" 
                  : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Stacks */}
      <div>
        <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Tech Stacks & Interests</label>
        <div className="flex flex-wrap gap-2">
          {TECH_STACKS.map(tech => {
            const isSelected = selectedTechs.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                  isSelected 
                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300" 
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700"
                }`}
              >
                {isSelected && <Check size={12} className="inline mr-1 -mt-0.5" />}
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">About You (Goals / Need a Tech Partner?)</label>
        <textarea 
          value={formData.bio}
          onChange={e => setFormData({...formData, bio: e.target.value})}
          className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none h-20 dark:text-white"
          placeholder="E.g. Looking for a frontend developer for a hackathon, or aiming for GSoC!"
        />
      </div>

      <div className="pt-2 sticky bottom-0 bg-white dark:bg-gray-900 pb-2">
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full rounded-xl h-11 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Next: Verify Email"}
        </Button>
      </div>
    </form>
  );
}
