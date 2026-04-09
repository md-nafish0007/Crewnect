"use client";

import { Loader2, MailCheck } from "lucide-react";
import { Button } from "./ui/button";

export function RegisterOtpForm({
  formData,
  setFormData,
  handleRegister,
  setStep,
  loading,
  error
}: {
  formData: any;
  setFormData: any;
  handleRegister: (e: React.FormEvent) => void;
  setStep: (step: 1 | 2) => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <form onSubmit={handleRegister} className="p-6 space-y-4 flex-1">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="text-center mb-6 pt-4">
        <MailCheck size={48} className="mx-auto text-blue-500 mb-4 opacity-80" />
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Please check your email inbox (and spam) for a 6-digit confirmation code.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200 text-center">6-Digit Code</label>
        <input 
          required 
          maxLength={6}
          type="text"
          value={formData.otp}
          onChange={e => setFormData({...formData, otp: e.target.value})}
          className="w-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.25em] font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all dark:text-white"
          placeholder="••••••"
        />
      </div>

      <div className="pt-4 flex gap-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setStep(1)}
          disabled={loading}
          className="flex-1 rounded-xl h-11"
        >
          Go Back
        </Button>
        <Button 
          type="submit" 
          disabled={loading || formData.otp.length < 6}
          className="flex-1 rounded-xl h-11 bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify & Join"}
        </Button>
      </div>
    </form>
  );
}
