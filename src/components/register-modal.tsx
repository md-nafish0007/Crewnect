"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { UserPlus, X, MailCheck } from "lucide-react";
import { Button } from "./ui/button";
import { RegisterDetailsForm } from "./register-details-form";
import { RegisterOtpForm } from "./register-otp-form";

export function RegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "Male",
    major: "B.Tech",
    year: "1st Year",
    bio: "",
    otp: "",
  });

  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP.");
      
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, techStacks: selectedTechs }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register.");

      setIsOpen(false);
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setIsOpen(false);
    setStep(1);
    setError(null);
  };

  const modalContent = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md md:max-w-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
          <div>
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
              {step === 1 ? <UserPlus className="text-blue-500" size={20} /> : <MailCheck className="text-green-500" size={20} />}
              {step === 1 ? "Register Account" : "Verify Email"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 ? "College ID required" : `OTP sent to ${formData.email}`}
            </p>
          </div>
          <button 
            onClick={resetModal}
            className="p-2 bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-300 rounded-full transition-colors"
            type="button"
          >
            <X size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Smart Form Rendering */}
        {step === 1 ? (
          <RegisterDetailsForm 
            formData={formData} 
            setFormData={setFormData}
            selectedTechs={selectedTechs}
            toggleTech={toggleTech}
            handleSendOtp={handleSendOtp}
            loading={loading}
            error={error}
          />
        ) : (
          <RegisterOtpForm 
            formData={formData} 
            setFormData={setFormData}
            handleRegister={handleRegister}
            setStep={setStep}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <Button 
        size="lg" 
        onClick={() => setIsOpen(true)}
        className="rounded-full shadow-md gap-2 h-12 px-8 animate-in slide-in-from-bottom-6 transition-transform hover:scale-105 active:scale-95"
      >
        <UserPlus size={18} /> Register
      </Button>

      {modalContent}
    </>
  );
}
