"use client";

import { useEffect, useState, useRef } from "react";
import { Send, MessageCircle, X, Bot, Globe, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface Message {
  id: string;
  text: string;
  user: string;
}

interface AiMessage {
  role: "user" | "model";
  text: string;
}

export function ChatBox({ currentUser }: { currentUser: { name: string } | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"global" | "ai">("global");
  
  // State for Global Chat
  const [messages, setMessages] = useState<Message[]>([]);
  // State for Crew AI
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) setMessages(await res.json());
    } catch (err) {}
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isOpen && activeTab === "global") {
      fetchMessages();
      intervalId = setInterval(fetchMessages, 2500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, activeTab]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiMessages, isOpen, activeTab]);

  const sendGlobalMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const messageToSend = input;
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: messageToSend, user: currentUser ? currentUser.name : "Anonymous User" }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageToSend, user: currentUser ? currentUser.name : "Anonymous User" }),
      });
      if (res.ok) fetchMessages();
    } catch (err) {}
  };

  const sendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || aiLoading) return;

    const userText = input;
    setAiMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();
      if (res.ok) {
        setAiMessages(prev => [...prev, { role: "model", text: data.text }]);
      } else {
        setAiMessages(prev => [...prev, { role: "model", text: `Error: ${data.error}` }]);
      }
    } catch (e) {
      setAiMessages(prev => [...prev, { role: "model", text: "Network connection failed." }]);
    }
    setAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (activeTab === "global") sendGlobalMessage(e);
    else sendAiMessage(e);
  };

  // Helper to format tiny markdown chunks
  const renderAiText = (text: string) => {
    return text.split('\n').map((line, i) => {
      let isBold = false;
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        return <li key={i} className="ml-4 list-disc text-sm py-0.5" dangerouslySetInnerHTML={{ __html: formatted.substring(1) }} />;
      }
      return <p key={i} className="mb-2 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-2xl shadow-blue-500/30 bg-blue-600 hover:bg-blue-700 hover:scale-110 transition-all text-white flex items-center justify-center border-2 border-white/20 animate-in zoom-in-50 duration-500 slide-in-from-bottom-5"
      >
        <MessageCircle size={24} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl shadow-blue-900/10 flex flex-col overflow-hidden border border-gray-100 z-50 animate-in slide-in-from-bottom-5">
      
      {/* Header Tabs */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-1 flex justify-between items-center shadow-md z-10 shrink-0">
        <div className="flex w-full bg-black/20 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("global")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "global" ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Globe size={14} /> Global Chat
          </button>
          <button 
            onClick={() => setActiveTab("ai")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "ai" ? 'bg-indigo-600 text-white shadow-lg flex items-center' : 'text-gray-400 hover:text-white'}`}
          >
            <Bot size={14} /> Crew AI
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="px-3 hover:bg-white/10 rounded-lg transition-colors text-gray-400 ml-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages View */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
        
        {/* GLOBAL TAB RENDER */}
        {activeTab === "global" && (
          messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <Globe size={40} className="opacity-20" />
              <p className="text-sm">Say hi to start the conversation!</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 animate-in fade-in">
                <span className="text-xs font-bold text-blue-600 mb-1 block">{m.user}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{m.text}</p>
              </div>
            ))
          )
        )}

        {/* AI TAB RENDER */}
        {activeTab === "ai" && (
          aiMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Bot size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-700">Team Building Advisor</p>
              <p className="text-xs text-gray-500">Tell me what stacks you know, and I'll compute what roles you need to complete your startup crew.</p>
            </div>
          ) : (
            aiMessages.map((m, idx) => {
              const isUsr = m.role === "user";
              return (
                <div key={idx} className={`flex ${isUsr ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
                  <div className={`px-4 py-3 max-w-[85%] rounded-2xl ${isUsr ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                    {isUsr ? <p className="text-sm leading-relaxed">{m.text}</p> : renderAiText(m.text)}
                  </div>
                </div>
              )
            })
          )
        )}

        {activeTab === "ai" && aiLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-indigo-500" /> <span className="text-xs text-gray-500">Analyzing...</span>
            </div>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={(activeTab === "global" && !currentUser) || aiLoading}
          placeholder={activeTab === "global" ? (currentUser ? "Type globally..." : "Log in to chat globally...") : "Ask the Crew AI..."}
          className="flex-1 border-gray-200 bg-gray-50 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner disabled:opacity-50"
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || (activeTab === "global" && !currentUser) || aiLoading}
          className={`rounded-full w-10 h-10 p-0 disabled:opacity-50 transition-colors shrink-0 ${activeTab === 'ai' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <Send size={16} className="-ml-1 mt-0.5 text-white" />
        </Button>
      </form>
    </div>
  );
}
