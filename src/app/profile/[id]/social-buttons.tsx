"use client";

import { useState } from "react";
import { UserPlus, Clock, Check, MessageSquare, AlertCircle, UserX } from "lucide-react";
import { useRouter } from "next/navigation";

export function SocialButtons({ 
  targetUserId, 
  initialStatus, 
  requestId,
  isSelf, 
  isLoggedIn 
}: { 
  targetUserId: string;
  initialStatus: string;
  requestId: string | null;
  isSelf: boolean;
  isLoggedIn: boolean;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: targetUserId })
      });
      if (res.ok) {
        setStatus("PENDING_SENT");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleAcceptRequest = async () => {
    if (!requestId) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/friend", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "ACCEPT" })
      });
      if (res.ok) {
        setStatus("ACCEPTED");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleCancelRequest = async () => {
    const isUnfriend = status === "ACCEPTED";
    if (isUnfriend && !confirm("Are you sure you want to remove this connection?")) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/friend", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: targetUserId })
      });
      if (res.ok) {
        setStatus("NONE");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const goToMessages = () => {
    router.push(`/messages?user=${targetUserId}`);
  };

  if (isSelf) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl flex items-center gap-3 justify-center text-sm text-gray-500 font-medium border border-dashed border-gray-200 dark:border-gray-800">
        <UserPlus size={18} /> This is your profile
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center gap-3 justify-center text-sm text-blue-600 dark:text-blue-400 font-medium">
        <AlertCircle size={18} /> Log in to connect with this standard app user!
      </div>
    );
  }

  return (
    <div className="flex gap-3 justify-center md:justify-start">
      {status === "NONE" && (
        <button 
          onClick={handleSendRequest}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/20"
        >
          <UserPlus size={18} /> {isLoading ? "Sending..." : "Send Request"}
        </button>
      )}

      {status === "PENDING_SENT" && (
        <button 
          onClick={handleCancelRequest}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-600 px-6 py-3 rounded-full font-semibold border border-gray-200 dark:border-gray-700 transition-all"
        >
          <Clock size={18} /> {isLoading ? "Canceling..." : "Cancel Request"}
        </button>
      )}

      {status === "PENDING_RECEIVED" && (
        <button 
          onClick={handleAcceptRequest}
          disabled={isLoading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold transition-all disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/20"
        >
          <Check size={18} /> {isLoading ? "Accepting..." : "Accept Request"}
        </button>
      )}

      {status === "ACCEPTED" && (
        <div className="flex gap-3">
          <button 
            onClick={goToMessages}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/20"
          >
            <MessageSquare size={18} /> Message Privately
          </button>
          <button 
            onClick={handleCancelRequest}
            disabled={isLoading}
            className="p-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
            title="Unfriend"
          >
            <UserX size={18} className="transition-transform group-hover:scale-110" />
          </button>
        </div>
      )}
    </div>
  );
}
