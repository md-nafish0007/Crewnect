"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Send, User, MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Friend {
  id: string;
  name: string;
}

interface DM {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
}

function InboxContent({ friends, currentUserId }: { friends: Friend[], currentUserId: string }) {
  const searchParams = useSearchParams();
  const initialUser = searchParams.get("user");

  const [activeFriendId, setActiveFriendId] = useState<string | null>(initialUser || (friends.length > 0 ? friends[0].id : null));
  const [messages, setMessages] = useState<DM[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const fetchDMs = async () => {
    if (!activeFriendId) return;
    try {
      const res = await fetch(`/api/dm?targetId=${activeFriendId}`);
      if (res.ok) setMessages(await res.json());
    } catch(e) {}
  };

  useEffect(() => {
    fetchDMs();
    const interval = setInterval(fetchDMs, 2500);
    return () => clearInterval(interval);
  }, [activeFriendId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeFriendId) return;
    
    // Optimistic fast update
    setMessages(p => [...p, { id: Date.now().toString(), senderId: currentUserId, receiverId: activeFriendId, text: input }]);
    const val = input;
    setInput("");

    await fetch("/api/dm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: activeFriendId, text: val })
    });
    fetchDMs();
  };

  if (friends.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <MessageCircle size={64} className="opacity-20 mb-4" />
        <p className="font-semibold text-lg">No connections yet!</p>
        <p className="text-sm">Head back to the directory and send some friend requests.</p>
      </div>
    );
  }

  const activeFriend = friends.find(f => f.id === activeFriendId);

  return (
    <div className="flex h-full w-full max-w-7xl mx-auto border-x border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
      
      {/* Sidebar List */}
      <div className="w-[300px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto flex flex-col">
        <div className="p-4 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 shrink-0">
          Your Connections ({friends.length})
        </div>
        <div className="flex-1 overflow-y-auto">
          {friends.map(f => (
            <button 
              key={f.id}
              onClick={() => setActiveFriendId(f.id)}
              className={`w-full text-left p-4 flex items-center gap-3 border-b border-gray-50 dark:border-gray-800/50 transition-colors ${activeFriendId === f.id ? 'bg-blue-50 dark:bg-blue-900/30 shadow-inner' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <div className={`rounded-full p-2 transition-colors ${activeFriendId === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                <User size={20} />
              </div>
              <span className={`font-semibold ${activeFriendId === f.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'}`}>
                {f.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-gray-950/50">
        {activeFriend ? (
           <>
             {/* Chat Header */}
             <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm shrink-0 z-10 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center font-bold">
                 {activeFriend.name.charAt(0)}
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{activeFriend.name}</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">• Connected</p>
               </div>
             </div>
             
             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {messages.length === 0 && (
                 <div className="h-full flex items-center justify-center text-center opacity-50">
                   Say hello to {activeFriend.name}!
                 </div>
               )}
               {messages.map(m => {
                 const isMe = m.senderId === currentUserId;
                 return (
                   <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                     <div 
                        className={`px-5 py-3 max-w-[70%] text-sm rounded-2xl shadow-sm ${
                          isMe 
                          ? 'bg-blue-600 text-white rounded-br-sm' 
                          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-sm text-gray-800 dark:text-gray-200'
                        }`}
                      >
                       {m.text}
                     </div>
                   </div>
                 )
               })}
               <div ref={endRef} />
             </div>

             {/* Input Box */}
             <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
               <form onSubmit={sendMsg} className="relative flex items-center">
                 <input 
                   value={input} 
                   onChange={e=>setInput(e.target.value)} 
                   className="w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-950 focus:ring-0 rounded-full pl-6 pr-14 py-4 text-sm transition-colors shadow-inner" 
                   placeholder={`Message ${activeFriend.name}...`} 
                 />
                 <button 
                   type="submit" 
                   disabled={!input.trim()}
                   className="absolute right-2 bg-blue-600 disabled:opacity-50 hover:bg-blue-700 transition-colors text-white rounded-full p-2.5 flex items-center justify-center shadow-md"
                 >
                   <Send size={18} className="translate-x-0.5" />
                 </button>
               </form>
             </div>
           </>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
             <MessageCircle size={48} className="mb-4 opacity-30"/>
             <p>Select a friend from the sidebar to chat.</p>
           </div>
        )}
      </div>
    </div>
  );
}

export function InboxManager({ friends, currentUserId }: { friends: Friend[], currentUserId: string }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading interface...</div>}>
      <InboxContent friends={friends} currentUserId={currentUserId} />
    </Suspense>
  )
}
