import React from "react";
import { Gamepad2, RefreshCcw } from "lucide-react";

/**
 * Captura erros na renderização do React e exibe uma tela amigável.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Erro capturado silenciosamente pela UI de Game Over
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-retro">
          <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl border-4 border-red-500 shadow-[8px_8px_0px_rgba(239,68,68,0.5)] text-center animate-in fade-in zoom-in duration-300">
            <Gamepad2 className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-3xl font-bold uppercase mb-4 tracking-widest text-red-400">
              Game Over
            </h1>
            <p className="text-gray-300 font-medium leading-relaxed mb-8">
              Parece que o console travou ou o cartucho oxidou. Tente assoprar e reiniciar.
            </p>
            <details className="text-left text-xs bg-gray-900 p-4 rounded-lg text-red-300 font-mono overflow-auto mb-8 whitespace-pre-wrap">
              <summary className="cursor-pointer mb-2 uppercase hover:text-red-200">
                Ver Log do Erro
              </summary>
              {this.state.error?.toString()}
            </details>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl border-2 border-black font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
            >
              <RefreshCcw className="w-5 h-5" /> Inserir Ficha (Recarregar)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
