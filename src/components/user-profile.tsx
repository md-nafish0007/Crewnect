"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

export function UserProfile({ user }: { user: { name: string, email: string } }) {
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4 animate-in slide-in-from-bottom-6">
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold dark:text-white">{user.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
      </div>
      <Button 
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="rounded-full shadow-sm"
      >
        <LogOut size={16} className="mr-2" /> Logout
      </Button>
    </div>
  );
}
