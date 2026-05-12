import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";
import { cn, getPixelAvatar } from "../../../lib/utils";

interface NavUserMenuProps {
  currentUser: any;
  profile: any;
  onLogout: () => void;
  onLoginClick: () => void;
  isDark: boolean;
}

export default function NavUserMenu({
  currentUser,
  profile,
  onLogout,
  onLoginClick,
  isDark
}: NavUserMenuProps) {
  if (!currentUser) {
    return (
      <button 
        onClick={onLoginClick} 
        className={cn(
          "px-5 py-2 rounded-xl font-retro font-black text-[10px] uppercase tracking-[0.1em] transition-all hover:scale-105 active:scale-95 border",
          isDark 
            ? "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white" 
            : "bg-purple-600/5 border-purple-500/20 text-purple-600 hover:bg-purple-600 hover:text-white"
        )}
      >
        LOGIN
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {currentUser.role === 'admin' && (
        <Link 
          to="/admin" 
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all group hover:bg-white/5",
            isDark ? "text-purple-400" : "text-purple-600"
          )}
          title="Painel Administrativo"
        >
          <ShieldCheck size={16} className="transition-transform group-hover:scale-110" />
          <span className="hidden lg:block font-retro text-[9px] font-black uppercase tracking-[0.05em] whitespace-nowrap">Painel</span>
        </Link>
      )}

      <Link 
        to="/dashboard" 
        className={cn(
          "flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all group hover:bg-white/5",
          isDark ? "text-purple-400" : "text-purple-600"
        )}
        title="Meu QG"
      >
        <div className="relative shrink-0">
          <img
            src={profile?.avatar || (currentUser.avatar ? currentUser.avatar : getPixelAvatar(currentUser.id))}
            alt=""
            className="w-7 h-7 rounded-[10px] border border-purple-500/30 object-cover transition-all group-hover:border-purple-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getPixelAvatar(currentUser.id);
            }}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
        </div>
        <span className="hidden lg:block font-retro text-[9px] font-black uppercase tracking-[0.05em] whitespace-nowrap">Meu QG</span>
      </Link>
      
      <button
        onClick={onLogout}
        className={cn(
          "p-2 rounded-xl transition-all group hover:bg-red-500/10",
          isDark ? "text-red-400" : "text-red-500"
        )}
        title="Sair"
      >
        <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
