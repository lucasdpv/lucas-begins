import React, { useState } from "react";
import { Inbox, Clock, Loader2, CheckCircle2, MailOpen, Reply, Trash2 } from "lucide-react";
import { cn, formatDate } from "../../../lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: any;
}

interface TabInboxProps {
  messages: Message[];
  isLoading: boolean;
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: Message['status']) => void;
  onDelete: (id: string) => void;
  onReply: (email: string, name: string) => void;
  isDark: boolean;
}

export default function TabInbox({
  messages,
  isLoading,
  onRefresh,
  onUpdateStatus,
  onDelete,
  onReply,
  isDark
}: TabInboxProps) {
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className={cn("rounded-2xl retro-card overflow-hidden", isDark ? "bg-gray-800" : "bg-snes-surface")}>
        <div className="p-4 md:p-6 border-b-2 border-purple-500/20 flex items-center justify-between">
           <h3 className="font-retro text-lg md:text-2xl font-bold uppercase flex items-center gap-2">
             <Inbox className="w-5 h-5 md:w-6 md:h-6 text-purple-500" /> Inbox
           </h3>
           <button 
            onClick={onRefresh}
            className="p-2 hover:bg-purple-600/10 rounded-lg transition-colors"
            title="Recarregar"
           >
             <Clock className={cn("w-5 h-5", isLoading && "animate-spin")} />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={cn(
              "font-retro uppercase text-[10px] md:text-xs tracking-wider border-b-2",
              isDark ? "bg-gray-900 border-purple-500 text-purple-300" : "bg-snes-mid border-snes-dark text-snes-accent"
            )}>
              <tr>
                <th className="px-4 md:px-6 py-4 md:py-5">Status</th>
                <th className="px-4 md:px-6 py-4 md:py-5">De</th>
                <th className="px-4 md:px-6 py-4 md:py-5 hidden md:table-cell">Mensagem</th>
                <th className="px-4 md:px-6 py-4 md:py-5">Data</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-gray-700" : "divide-gray-200")}>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                       <p className="font-retro uppercase text-xs opacity-50">Carregando mensagens...</p>
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="font-retro uppercase text-sm opacity-30">Nenhuma mensagem encontrada.</p>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <React.Fragment key={msg.id}>
                    <tr 
                      className={cn(
                        "transition-all group cursor-pointer border-l-4",
                        expandedMessageId === msg.id ? "border-purple-500 shadow-inner" : "border-transparent",
                        msg.status === 'new' 
                          ? isDark ? "bg-purple-500/5 hover:bg-purple-500/10" : "bg-purple-50 hover:bg-purple-100"
                          : isDark ? "hover:bg-gray-700/50" : "hover:bg-snes-mid"
                      )}
                      onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                    >
                      <td className="px-6 py-5">
                        {msg.status === 'new' ? (
                          <span className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Nova
                          </span>
                        ) : msg.status === 'replied' ? (
                          <span className="flex items-center gap-2 text-green-500 font-bold uppercase text-[10px] tracking-widest opacity-60">
                            <CheckCircle2 size={14} /> Respondida
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest opacity-60">
                            <MailOpen size={14} /> Lida
                          </span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm md:text-base tracking-tight truncate max-w-[80px] md:max-w-none">{msg.name}</span>
                          <span className="text-[10px] opacity-50 font-mono truncate max-w-[80px] md:max-w-none">{msg.email}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 hidden md:table-cell">
                        <p className="text-xs line-clamp-1 opacity-70 italic max-w-xs font-mono">
                          "{msg.message}"
                        </p>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 opacity-40 text-[9px] md:text-[10px] font-bold font-retro uppercase tracking-tighter whitespace-nowrap">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5 md:gap-2">
                          <button
                            onClick={() => onReply(msg.email, msg.name)}
                            className="p-1.5 md:p-2.5 bg-purple-600 text-white rounded-lg md:rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-purple-900/20"
                            title="Responder via E-mail"
                          >
                            <Reply className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                          
                          {msg.status === 'new' && (
                            <button
                              onClick={() => onUpdateStatus(msg.id, 'read')}
                              className="p-1.5 md:p-2.5 bg-blue-500/10 text-blue-500 border-2 border-blue-500/30 rounded-lg md:rounded-xl hover:bg-blue-500 hover:text-white transition-all active:scale-95"
                              title="Marcar como lida"
                            >
                              <MailOpen className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          )}

                          {msg.status !== 'replied' && (
                            <button
                              onClick={() => onUpdateStatus(msg.id, 'replied')}
                              className="p-1.5 md:p-2.5 bg-green-500/10 text-green-500 border-2 border-green-500/30 rounded-lg md:rounded-xl hover:bg-green-500 hover:text-white transition-all active:scale-95"
                              title="Marcar como respondida"
                            >
                              <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => onDelete(msg.id)}
                            className="p-1.5 md:p-2.5 bg-red-500/10 text-red-500 border-2 border-red-500/30 rounded-lg md:rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                            title="Excluir"
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Conteúdo Expandido da Mensagem */}
                    {expandedMessageId === msg.id && (
                      <tr className={cn(isDark ? "bg-gray-800/80" : "bg-purple-50/50")}>
                        <td colSpan={5} className="px-2 md:px-10 py-4 md:py-10">
                          <div className={cn(
                            "p-4 md:p-8 rounded-3xl border-4 shadow-2xl relative overflow-hidden transition-all animate-in slide-in-from-top-4 duration-300",
                            isDark ? "bg-gray-900 border-purple-600/30" : "bg-white border-purple-200"
                          )}>
                            <div className="relative z-10">
                              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-gray-700/30 gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-xl md:text-2xl shadow-lg border-2 border-black/20">
                                    ✉️
                                  </div>
                                  <div>
                                    <h4 className="font-retro text-sm md:text-lg font-bold text-purple-500 leading-none mb-1">
                                      Mensagem de {msg.name}
                                    </h4>
                                    <p className="text-[10px] md:text-xs opacity-50 font-mono">{msg.email}</p>
                                  </div>
                                </div>
                                <div className="md:text-right">
                                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-40">Recebido em</p>
                                  <p className="text-[10px] md:text-xs font-mono">{formatDate(msg.createdAt)}</p>
                                </div>
                              </div>

                              <div className={cn(
                                "p-4 md:p-8 rounded-2xl border-2 font-medium text-sm md:text-lg leading-relaxed whitespace-pre-wrap",
                                isDark ? "bg-gray-800/50 border-gray-700/50 text-gray-200" : "bg-gray-50 border-gray-100 text-gray-800"
                              )}>
                                {msg.message}
                              </div>
                              
                              <div className="mt-8 flex justify-end gap-4">
                                <button 
                                  onClick={() => onReply(msg.email, msg.name)}
                                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-retro text-xs font-bold uppercase flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                                >
                                  <Reply size={16} /> Responder Agora
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
