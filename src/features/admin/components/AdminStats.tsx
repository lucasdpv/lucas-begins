import React from "react";
import { Edit, Tag, Inbox, User } from "lucide-react";
import { cn } from "../../../lib/utils";

interface AdminStatsProps {
  postsCount: number;
  categoriesCount: number;
  messagesCount: number;
  level: number;
  isDark: boolean;
}

export default function AdminStats({ 
  postsCount, 
  categoriesCount, 
  messagesCount, 
  level, 
  isDark 
}: AdminStatsProps) {
  const stats = [
    { label: "Artigos", value: postsCount, icon: Edit, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Categorias", value: categoriesCount, icon: Tag, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Mensagens", value: messagesCount, icon: Inbox, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Level", value: level, icon: User, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border-4 flex flex-col sm:flex-row items-center sm:items-center gap-3 md:gap-5 transition-all group text-center sm:text-left",
            isDark 
              ? "bg-gray-800/40 border-gray-700/50 hover:border-purple-500/50 shadow-xl shadow-purple-900/5" 
              : "bg-white border-gray-100 hover:border-purple-200 shadow-xl shadow-black/5"
          )}
        >
          <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
            <stat.icon size={20} className="md:size-[26px]" />
          </div>
          <div>
            <p className="text-[9px] md:text-xs font-retro font-bold uppercase tracking-widest opacity-50 mb-0.5 md:mb-1">{stat.label}</p>
            <p className="text-xl md:text-3xl font-bold font-retro leading-none">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
