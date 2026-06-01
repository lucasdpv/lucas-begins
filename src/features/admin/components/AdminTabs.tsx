import { Edit, Tag, Inbox, User, Cpu } from "lucide-react";
import { cn } from "../../../lib/utils";

export type AdminTab = "posts" | "categories" | "messages" | "profile" | "system";

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
    { id: "system" as AdminTab, label: "Ferramentas do Sistema", icon: Cpu },
  ];

  return (
    <div className={cn(
      "p-2 rounded-none border-4 border-black mb-8 md:mb-10 flex flex-wrap items-center justify-center lg:justify-start gap-1 md:gap-2 transition-all shadow-[6px_6px_0px_rgba(0,0,0,1)]",
      isDark ? "bg-[#1f1d35] text-white" : "bg-white text-black"
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-none font-retro text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all duration-300 flex-1 min-w-[120px] md:flex-initial border-2 border-transparent",
            activeTab === tab.id 
              ? "bg-purple-600 text-white border-black shadow-[4px_4px_0_rgba(0,0,0,1)]"
              : (isDark ? "text-gray-400 hover:text-white hover:bg-gray-800/50" : "text-gray-500 hover:text-purple-600 hover:bg-gray-100")
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
