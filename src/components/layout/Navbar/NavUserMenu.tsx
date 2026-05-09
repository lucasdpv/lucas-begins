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
          "px-6 py-2.5 rounded-2xl font-retro font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border-2 shadow-lg",
          isDark 
            ? "bg-purple-600 border-purple-400 text-white shadow-purple-500/20" 
            : "bg-purple-600 border-purple-700 text-white shadow-purple-600/20"
        )}
      >
        LOGIN
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {currentUser.role === 'admin' && (
        <Link 
          to="/admin" 
          className={cn(
            "flex items-center gap-2 p-1.5 pr-3 rounded-xl border-2 transition-all group",
            isDark ? "border-purple-600/40 bg-purple-600/10 hover:bg-purple-600/20" : "border-purple-500/30 bg-purple-50 hover:bg-purple-100"
          )}
          title="Painel Administrativo"
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all group-hover:scale-110",
            isDark ? "bg-purple-600 border-purple-400 text-white" : "bg-purple-600 border-purple-700 text-white"
          )}>
            <ShieldCheck size={18} />
          </div>
          <span className="font-retro text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Meu Painel</span>
        </Link>
      )}

      <div className="flex items-center gap-2">
        <Link 
          to="/dashboard" 
          className={cn(
            "flex items-center gap-2 p-1.5 pr-3 rounded-xl border-2 transition-all group",
            isDark ? "border-purple-500/30 hover:bg-purple-500/20" : "border-purple-500/30 bg-purple-50 hover:bg-purple-100"
          )}
          title="Meu QG"
        >
          <div className="relative shrink-0">
            <img
              src={profile?.avatar || (currentUser.avatar ? currentUser.avatar : getPixelAvatar(currentUser.id))}
              alt=""
              className="w-8 h-8 rounded-lg border border-purple-500/50 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getPixelAvatar(currentUser.id);
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
          </div>
          <span className="font-retro text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Meu QG</span>
        </Link>
        
        <button
          onClick={onLogout}
          className={cn(
            "p-2 rounded-xl border-2 transition-all",
            isDark 
              ? "border-red-500/30 text-red-400 hover:bg-red-500/20" 
              : "border-red-500/20 text-red-500 hover:bg-red-50"
          )}
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
