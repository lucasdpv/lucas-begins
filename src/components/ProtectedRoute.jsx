import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";

/**
 * Componente que protege rotas que exigem autenticação e permissão.
 * Enquanto carrega, exibe um loading. Se o usuário não tiver acesso,
 * redireciona para a home silenciosamente.
 *
 * @param {React.ReactNode} children - Conteúdo a ser exibido se autorizado
 * @param {"admin"|"user"} requiredRole - Role mínima para acessar a rota
 */
export default function ProtectedRoute({ children, requiredRole = "admin" }) {
  const { currentUser, authLoading } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== requiredRole)) {
      navigate("/", { replace: true });
    }
  }, [currentUser, authLoading, requiredRole, navigate]);

  // Enquanto o Firebase verifica a sessão, exibe um loading neutro
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-4 opacity-50">
        <Gamepad2 className="w-8 h-8 animate-pulse text-purple-500" />
        <span className="font-retro uppercase text-sm font-bold">Verificando credenciais...</span>
      </div>
    );
  }

  // Se não autorizado, não renderiza nada (o useEffect já redireciona)
  if (!currentUser || currentUser.role !== requiredRole) {
    return null;
  }

  return children;
}
