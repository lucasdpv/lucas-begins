import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/router-compat";
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
  isDark,
}: NavUserMenuProps) {
  // O usuário chega do Firebase depois do HTML do servidor; renderizar "Login" ou o avatar já na
  // hidratação faz o React descartar o HTML do servidor (erro de hydration). Até montar, só um espaço reservado.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <div aria-hidden="true" className="w-[88px] h-9" />;
  }

  if (!currentUser) {
    return (
      <button
        type="button"
        onClick={onLoginClick}
        className={cn(
          "px-5 py-2.5 rounded-xl font-retro font-black text-xs uppercase tracking-widest leading-none transition-all hover:scale-105 active:scale-95 border cursor-pointer",
          isDark
            ? "bg-purple-500/15 border-purple-500/35 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.2)]"
            : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white"
        )}
      >
        Login
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {currentUser.role === "admin" && (
        <Link
          to="/admin"
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all group hover:bg-white/[0.05] shrink-0",
            isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"
          )}
          title="Painel Administrativo"
        >
          <ShieldCheck size={17} className="transition-transform group-hover:scale-110 shrink-0" />
          <span className="hidden xl:block font-retro text-xs font-black uppercase tracking-widest leading-none whitespace-nowrap">
            Painel
          </span>
        </Link>
      )}

      <Link
        to="/dashboard"
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all group hover:bg-white/[0.05] shrink-0",
          isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"
        )}
        title="Meu QG"
      >
        <div className="relative shrink-0">
          <Image
            src={profile?.avatar || (currentUser.avatar ? currentUser.avatar : getPixelAvatar(currentUser.id))}
            alt=""
            className="w-8 h-8 rounded-[10px] border border-purple-500/30 object-cover transition-all group-hover:border-purple-500"
            width={32}
            height={32}
            unoptimized={true}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
        </div>
        <span className="hidden xl:block font-retro text-xs font-black uppercase tracking-widest leading-none whitespace-nowrap">
          Meu QG
        </span>
      </Link>

      {/* Divider */}
      <div className={cn("w-px h-5 shrink-0 mx-0.5", isDark ? "bg-white/10" : "bg-black/10")} />

      <button
        type="button"
        onClick={onLogout}
        className={cn(
          "p-2 rounded-xl transition-all group hover:bg-red-500/10 cursor-pointer",
          isDark ? "text-red-400" : "text-red-500"
        )}
        title="Sair"
      >
        <LogOut size={17} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
