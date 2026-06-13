import React from "react";
import { createPortal } from "react-dom";
import { Trash2, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  type: string | null;
  isDark: boolean;
}

export default function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  type, 
  isDark 
}: DeleteModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            "relative w-full max-w-md border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden",
            isDark ? "bg-gray-900 text-white" : "bg-white text-black"
          )}
        >
          <div className="bg-red-600 p-4 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-white" />
              <h2 className="font-retro text-lg font-bold uppercase text-white tracking-widest">Confirmar Exclusão</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-black/20 rounded transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <p className="font-retro text-sm leading-relaxed">
              Tem certeza que deseja excluir este(a) <span className="text-red-500 font-bold">{type}</span>?
            </p>
            <div className={cn(
              "p-4 border-2 border-black bg-gray-100 rounded-none italic",
              isDark ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-600"
            )}>
              "{title}"
            </div>
            <p className="text-[10px] uppercase font-bold text-red-500">
              * Esta ação é irreversível e removerá os dados permanentemente do banco de dados.
            </p>
          </div>

          <div className="p-6 pt-0 flex gap-4">
            <button
              onClick={onClose}
              className={cn(
                "flex-1 py-3 border-2 border-black font-retro text-xs font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all",
                isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
              )}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-red-600 text-white border-2 border-black font-retro text-xs font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-red-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Excluir
            </button>
          </div>

          <div className="h-2 bg-red-600" />
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
