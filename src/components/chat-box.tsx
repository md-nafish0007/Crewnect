"use client";

import { useEffect, useState, useRef } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";

interface Message {
  id: string;
  text: string;
  user: string;
}

export function ChatBox({ currentUser }: { currentUser: { name: string } | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Fetch messages from the serverless API
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isOpen) {
      fetchMessages(); // Fetch immediately when opening

      // Establish a lightweight HTTP short-polling loop every 2.5 seconds
      intervalId = setInterval(() => {
        fetchMessages();
      }, 2500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Optimistic UI update for perceived instant speed
    const tempMessage = {
      id: Date.now().toString(),
      text: input,
      user: currentUser ? currentUser.name : "Anonymous User"
    };
    setMessages((prev) => [...prev, tempMessage]);
    const messageToSend = input;
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: messageToSend, 
          user: currentUser ? currentUser.name : "Anonymous User" 
        }),
      });
      // Silent refresh to ensure exact database sync
      if (res.ok) fetchMessages();
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all text-white flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl shadow-blue-900/10 flex flex-col overflow-hidden border border-gray-100 z-50 animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md z-10">
        <div>
          <h3 className="font-bold flex items-center gap-2">
            Global Chat <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
          </h3>
          <p className="text-xs text-blue-100 opacity-80">
            {currentUser ? `Talking as ${currentUser.name}` : "Log in to chat"}
          </p>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
            <MessageCircle size={40} className="opacity-20" />
            <p className="text-sm">Say hi to start the conversation!</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 animate-in fade-in">
              <span className="text-xs font-bold text-indigo-600 mb-1 block">{m.user}</span>
              <p className="text-sm text-gray-700 leading-relaxed">{m.text}</p>
            </div>
          ))
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!currentUser}
          placeholder={currentUser ? "Type a message..." : "Log in to chat..."}
          className="flex-1 border-gray-200 bg-gray-50 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner disabled:opacity-50"
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || !currentUser}
          className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
        >
          <Send size={16} className="-ml-1 mt-0.5 text-white" />
        </Button>
      </form>
    </div>
  );
}
