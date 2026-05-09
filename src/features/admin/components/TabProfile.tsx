import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { cn } from "../../../lib/utils";

interface TabProfileProps {
  initialData: {
    name: string;
    avatar: string;
    bio: string;
    level: number;
    aka: string;
  };
  onSave: (data: any) => void;
  isDark: boolean;
}

export default function TabProfile({ initialData, onSave, isDark }: TabProfileProps) {
  const [profileData, setProfileData] = useState(initialData);

  // Sincroniza se os dados iniciais mudarem (ex: após fetch inicial)
  useEffect(() => {
    setProfileData(initialData);
  }, [initialData]);

  const handleSave = () => {
    onSave(profileData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
      {/* Formulário */}
      <div className={cn("lg:col-span-2 p-6 md:p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
        <h3 className="font-retro text-lg md:text-2xl font-bold uppercase mb-6 md:mb-8 flex items-center gap-2 md:gap-3 border-b-2 border-purple-500 pb-2 md:pb-3">
          <User className="w-5 h-5 md:w-6 md:h-6 text-purple-500" /> Perfil de Autor
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">Nome</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className={cn(
                  "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium text-sm md:text-base",
                  isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">AKA</label>
              <input
                type="text"
                value={profileData.aka}
                onChange={(e) => setProfileData(prev => ({ ...prev, aka: e.target.value }))}
                className={cn(
                  "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium text-sm md:text-base",
                  isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                )}
                placeholder="Ex: Luck, The Boss..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">URL Foto</label>
              <input
                type="url"
                value={profileData.avatar}
                onChange={(e) => setProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                className={cn(
                  "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium text-sm md:text-base",
                  isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                )}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">Level</label>
              <input
                type="number"
                value={profileData.level}
                onChange={(e) => setProfileData(prev => ({ ...prev, level: parseInt(e.target.value) || 0 }))}
                className={cn(
                  "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium text-sm md:text-base",
                  isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className={cn(
                "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium resize-none text-sm md:text-base",
                isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-mid text-snes-accent"
              )}
              placeholder="Escreva algo sobre você..."
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full md:w-auto bg-purple-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-retro uppercase text-sm md:text-lg font-bold retro-button shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-purple-500 transition-all"
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Preview do Author Box */}
      <div className="lg:col-span-1">
        <h4 className="font-retro text-sm font-bold uppercase mb-4 opacity-50">Preview no Post</h4>
        <div className={cn("p-6 rounded-3xl border-2 relative overflow-hidden", isDark ? "bg-gray-800/40 border-purple-500/30" : "bg-snes-input border-snes-dark/10")}>
           <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-600 shadow-[4px_4px_0px_rgba(0,0,0,1)] -rotate-3">
                  <img 
                    src={profileData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas"} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-1 px-2 rounded-lg border-2 border-black font-bold text-[10px] shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                   LV.{profileData.level}
                </div>
              </div>
              <div>
                <h5 className="font-retro text-xl font-bold uppercase">
                  {profileData.name || "Seu Nome"}
                  {profileData.aka && <span className="text-xs text-purple-500 ml-2">(aka {profileData.aka})</span>}
                </h5>
                <p className={cn("text-xs leading-relaxed mt-2 line-clamp-3", isDark ? "text-gray-400" : "text-gray-600")}>
                  {profileData.bio || "Sua bio aparecerá aqui..."}
                </p>
              </div>
           </div>
        </div>
        <p className="text-[10px] uppercase font-bold mt-4 opacity-40 text-center italic">
          * O Author Box completo aparece no fim de cada post se ativado.
        </p>
      </div>
    </div>
  );
}
