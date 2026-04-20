import React from "react";
import { X, Mail, Gamepad2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function LoginModal() {
  const { isDark, setIsLoginModalOpen, login } = useAppContext();

  const handleGoogleLogin = async () => {
    await login();
    setIsLoginModalOpen(false);
  };

  const onClose = () => setIsLoginModalOpen(false);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className={cn(
        "w-full max-w-md rounded-3xl p-10 retro-card relative overflow-hidden",
        isDark ? "bg-gray-900" : "bg-white"
      )}>
        {/* Decoração Retro */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-center mb-8 border-b-2 border-purple-500 pb-6">
          <h3 className="font-retro text-3xl font-bold uppercase tracking-tight flex items-center gap-3">
            <Gamepad2 className="text-purple-500 w-8 h-8" />
            Login Player 1
          </h3>
          <button
            onClick={onClose}
            className="retro-button p-2 rounded-xl bg-red-500 text-white border-black hover:scale-110 active:scale-95 transition-transform"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-3">
            <p className={cn("text-lg font-medium leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
              Identifique-se para salvar seu progresso, curtir artigos e participar da discussão em nossa revista digital.
            </p>
            <p className="text-xs uppercase font-retro font-bold opacity-40 tracking-widest">
              Conexão Segura estabelecida
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className={cn(
              "group w-full flex items-center justify-center gap-4 p-5 rounded-2xl font-bold font-retro text-xl uppercase transition-all retro-button border-4",
              isDark 
                ? "bg-white text-black border-purple-500 hover:bg-purple-500 hover:text-white" 
                : "bg-white text-black border-black hover:bg-black hover:text-white"
            )}
          >
            <Mail className="w-6 h-6 group-hover:scale-125 transition-transform" />
            Acessar com Google
          </button>

          <p className="text-[10px] text-center opacity-40 uppercase font-bold tracking-tighter">
            Ao entrar, você concorda com nossos termos de conduta e privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
