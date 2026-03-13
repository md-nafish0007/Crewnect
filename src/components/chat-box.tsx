"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send, MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";

interface Message {
  id: string;
  text: string;
  user: string;
}

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !socketRef.current) {
      // Connect to the same origin server.js
      socketRef.current = io();
      
      socketRef.current.on("chat message", (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {};
  }, [isOpen]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;
    
    socketRef.current.emit("chat message", { text: input });
    setInput("");
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
            Global Anonymous Chat <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
          </h3>
          <p className="text-xs text-blue-100 opacity-80">Talk with registered students</p>
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
          placeholder="Type a message..."
          className="flex-1 border-gray-200 bg-gray-50 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
        />
        <Button 
          type="submit" 
          disabled={!input.trim()}
          className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
        >
          <Send size={16} className="-ml-1 mt-0.5 text-white" />
        </Button>
      </form>
    </div>
  );
}
