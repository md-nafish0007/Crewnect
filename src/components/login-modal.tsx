"use client";

import { useState } from "react";
import { LogIn, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to login.");
      }

      setIsOpen(false);
      window.location.reload(); 
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
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="rounded-full gap-2 h-12 px-8 animate-in slide-in-from-bottom-6"
      >
        <LogIn size={18} /> Login
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <div>
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                  <LogIn className="text-blue-500" size={20} /> Welcome Back
                </h3>
                <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
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

              <div>
                <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">Password *</label>
                <input 
                  required 
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full rounded-xl h-11"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
