import React from "react";
import { X, MessageSquare, Mail } from "lucide-react";
import { MOCK_USERS } from "../../data/mockData";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function LoginModal() {
  const { isDark, setIsLoginModalOpen, login, showToast } = useAppContext();

  const handleLogin = (user) => {
    login(user);
    setIsLoginModalOpen(false);
    showToast(`Bem-vindo, ${user.name}`);
  };

  const onClose = () => setIsLoginModalOpen(false);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className={cn("w-full max-w-sm rounded-xl p-8 retro-card", isDark ? "bg-gray-900" : "bg-white")}>
        <div className="flex justify-between items-center mb-8 border-b-2 border-purple-500 pb-4">
          <h3 className="font-retro text-2xl font-bold uppercase">Acesso Retro</h3>
          <button
            onClick={onClose}
            className="retro-button p-1 rounded-md bg-red-500 text-white border-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm mb-6 opacity-80 font-medium">
          No mundo real, checaríamos seu e-mail no banco de dados. Para testar aqui:
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin(MOCK_USERS.admin)}
            className="w-full flex items-center justify-between p-4 rounded-lg font-bold font-retro uppercase transition-transform retro-button bg-[#5865F2] text-white border-black"
          >
            <span className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" /> Discord
            </span>
            <span className="text-[10px] opacity-80">(Simula o Admin)</span>
          </button>

          <button
            onClick={() => handleLogin(MOCK_USERS.reader)}
            className="w-full flex items-center justify-between p-4 rounded-lg font-bold font-retro uppercase transition-transform retro-button bg-white text-black border-black"
          >
            <span className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-red-500" /> Google
            </span>
            <span className="text-[10px] text-gray-500">(Simula Leitor)</span>
          </button>
        </div>

        <p className="text-xs mt-6 text-center opacity-50 italic">
          Ao entrar, você concorda com nossos Termos de Serviço.
        </p>
      </div>
    </div>
  );
}
