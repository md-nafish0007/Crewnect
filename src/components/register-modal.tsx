"use client";

import { useState } from "react";
import { UserPlus, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export function RegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "Male",
    major: "",
    bio: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register.");
      }

      setIsOpen(false);
      window.location.reload(); // Quick dynamic refresh for the new single-page setup
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        size="lg" 
        onClick={() => setIsOpen(true)}
        className="rounded-full shadow-lg shadow-blue-500/30 gap-2 h-12 px-8 animate-in slide-in-from-bottom-6"
      >
        <UserPlus size={18} /> Join the Crew Directory
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <div>
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                  <UserPlus className="text-blue-500" size={20} /> Register Account
                </h3>
                <p className="text-sm text-gray-500 mt-1">College ID required</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-300 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">Full Name *</label>
                <input 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  placeholder="e.g. John Doe"
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
                  placeholder="YOUR_ID@delhitechnicalcampus.ac.in"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">Major</label>
                  <input 
                    value={formData.major}
                    onChange={e => setFormData({...formData, major: e.target.value})}
                    className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                    placeholder="e.g. B.Tech"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">Short Bio</label>
                <textarea 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none h-20 dark:text-white"
                  placeholder="What are your interests or skills?"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full rounded-xl h-11"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Complete Registration"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
