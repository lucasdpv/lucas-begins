import React from "react";
import { Edit, Tag, Inbox, User, Wrench } from "lucide-react";
import { cn } from "../../../lib/utils";

export type AdminTab = "posts" | "categories" | "messages" | "profile" | "tools";

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  hasNewMessages: boolean;
  isDark: boolean;
}

export default function AdminTabs({ 
  activeTab, 
  onTabChange, 
  hasNewMessages, 
  isDark 
}: AdminTabsProps) {
  const tabs = [
    { id: "posts" as AdminTab, label: "Artigos", icon: Edit },
    { id: "categories" as AdminTab, label: "Categorias", icon: Tag },
    { id: "messages" as AdminTab, label: "Inbox", icon: Inbox, badge: hasNewMessages },
    { id: "profile" as AdminTab, label: "Perfil", icon: User },
    { id: "tools" as AdminTab, label: "Ferramentas", icon: Wrench },
  ];

  return (
    <div className={cn(
      "p-2 rounded-[1.5rem] md:rounded-[2.5rem] border-4 mb-8 md:mb-10 flex flex-wrap items-center justify-center lg:justify-start gap-1 md:gap-2 backdrop-blur-md transition-all",
      isDark ? "bg-gray-900/40 border-gray-800/50" : "bg-gray-100/60 border-gray-200"
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-[1rem] md:rounded-[1.8rem] font-retro text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all duration-300 flex-1 min-w-[120px] md:flex-initial",
            activeTab === tab.id 
              ? (isDark ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "bg-purple-600 text-white shadow-lg shadow-purple-200")
              : (isDark ? "text-gray-400 hover:text-white hover:bg-gray-800/50" : "text-gray-500 hover:text-purple-600 hover:bg-white")
          )}
        >
          <tab.icon size={14} className="md:size-4" />
          {tab.label}
          {tab.badge && (
            <span className="absolute top-2 right-3 md:top-3 md:right-4 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-gray-900 shadow-sm" />
          )}
        </button>
      ))}
    </div>
  );
}
