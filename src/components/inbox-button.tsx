"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { MessageSquareDashed } from "lucide-react";
import toast from "react-hot-toast";

export function InboxButton() {
  const [pendingCount, setPendingCount] = useState(0);
  const prevCount = useRef(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // Detect if a new request was added
          if (data.count > prevCount.current) {
            toast.success("New Crew Request Received!", {
              icon: "👋",
              style: {
                borderRadius: '100px',
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #374151'
              },
            });
          }
          prevCount.current = data.count;
          setPendingCount(data.count);
        }
      } catch (err) {
        // fail silently for background polling
      }
    };

    // Fetch immediately on mount
    fetchNotifications();

    // Poll every 5 seconds to give a real-time notification feel
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link 
      href="/messages" 
      className="fixed top-6 right-20 z-50 rounded-full w-10 h-10 bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
      title="My Inbox"
    >
      <MessageSquareDashed className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
      {pendingCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center border border-white dark:border-gray-900 shadow-sm animate-in zoom-in">
            {pendingCount}
          </span>
        </span>
      )}
    </Link>
  );
}
