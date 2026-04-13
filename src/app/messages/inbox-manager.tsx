"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Send, User, MessageCircle, UserX, UserCheck, Inbox, ExternalLink } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Connection {
  id: string;
  name: string;
  requestId: string;
  status: string;
  isIncoming: boolean;
}

interface DM {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
}

function InboxContent({ connections, currentUserId }: { connections: Connection[], currentUserId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUser = searchParams.get("user");

  const [activeFriendId, setActiveFriendId] = useState<string | null>(initialUser || (connections.length > 0 ? connections[0].id : null));
  const [messages, setMessages] = useState<DM[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleRequestAction = async (requestId: string, action: "ACCEPT" | "REJECT") => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/friend", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action })
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {}
    setIsProcessing(false);
  };

  if (connections.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <MessageCircle size={64} className="opacity-20 mb-4" />
        <p className="font-semibold text-lg">No connections yet!</p>
        <p className="text-sm">Head back to the directory and send some friend requests.</p>
      </div>
    );
  }

  const activeFriend = connections.find(f => f.id === activeFriendId);

  return (
    <div className="flex h-full w-full max-w-7xl mx-auto border-x border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
      
      {/* Sidebar List */}
      <div className="w-[300px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto flex flex-col">
        <div className="p-4 font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 shrink-0">
          Your Connections ({connections.length})
        </div>
        <div className="flex-1 overflow-y-auto">
          {connections.map(f => (
            <button 
              key={f.id}
              onClick={() => setActiveFriendId(f.id)}
              className={`w-full text-left p-4 flex items-center gap-3 border-b border-gray-50 dark:border-gray-800/50 transition-colors ${activeFriendId === f.id ? 'bg-blue-50 dark:bg-blue-900/30 shadow-inner' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <div className="relative">
                <div className={`rounded-full p-2 transition-colors ${activeFriendId === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                  <User size={20} />
                </div>
                {f.isIncoming && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`font-semibold block truncate ${activeFriendId === f.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'}`}>
                  {f.name}
                </span>
                {f.isIncoming && (
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">New Request</span>
                )}
              </div>
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
               <Link 
                 href={`/profile/${activeFriend.id}`}
                 className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center font-bold hover:ring-2 hover:ring-indigo-500 transition-all shadow-sm"
                 title="View Profile"
               >
                 {activeFriend.name.charAt(0)}
               </Link>
               <div className="flex-1">
                  <Link 
                    href={`/profile/${activeFriend.id}`}
                    className="group flex items-center gap-1.5"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {activeFriend.name}
                    </h3>
                    <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  {activeFriend.isIncoming ? (
                    <p className="text-xs text-red-500 dark:text-red-400 font-bold tracking-tight">• Crew Request Pending</p>
                  ) : (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">• Connected</p>
                  )}
               </div>
               
               {activeFriend.isIncoming && (
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleRequestAction(activeFriend.requestId, "REJECT")}
                      disabled={isProcessing}
                      className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors cursor-pointer"
                      title="Reject Request"
                    >
                      <UserX size={20} />
                    </button>
                    <button 
                      onClick={() => handleRequestAction(activeFriend.requestId, "ACCEPT")}
                      disabled={isProcessing}
                      className="p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                      title="Accept Request"
                    >
                      <UserCheck size={20} />
                    </button>
                 </div>
               )}
             </div>
             
             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {activeFriend.isIncoming && (
                 <div className="flex flex-col items-center justify-center space-y-4 py-8 px-4 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                    <Inbox className="h-12 w-12 text-red-400 opacity-50" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{activeFriend.name} wants to connect with you!</p>
                      <Link 
                        href={`/profile/${activeFriend.id}`}
                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        Check their profile <ExternalLink size={12} />
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-[250px] mx-auto">Accept their request to start messaging privately.</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleRequestAction(activeFriend.requestId, "REJECT")}
                        disabled={isProcessing}
                        className="px-6 py-2 rounded-full text-xs font-bold text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        Ignore
                      </button>
                      <button 
                        onClick={() => handleRequestAction(activeFriend.requestId, "ACCEPT")}
                        disabled={isProcessing}
                        className="px-6 py-2 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
                      >
                        Accept Crew Request
                      </button>
                    </div>
                 </div>
               )}

               {messages.length === 0 && !activeFriend.isIncoming && (
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
             <div className={`p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0 ${activeFriend.isIncoming ? "opacity-30 pointer-events-none grayscale" : ""}`}>
               <form onSubmit={sendMsg} className="relative flex items-center">
                 <input 
                   value={input} 
                   onChange={e=>setInput(e.target.value)} 
                   disabled={activeFriend.isIncoming}
                   className="w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-950 focus:ring-0 rounded-full pl-6 pr-14 py-4 text-sm transition-colors shadow-inner" 
                   placeholder={activeFriend.isIncoming ? "Connect to start chatting..." : `Message ${activeFriend.name}...`} 
                 />
                 <button 
                   type="submit" 
                   disabled={!input.trim() || activeFriend.isIncoming}
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

export function InboxManager({ connections, currentUserId }: { connections: Connection[], currentUserId: string }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading interface...</div>}>
      <InboxContent connections={connections} currentUserId={currentUserId} />
    </Suspense>
  )
}
