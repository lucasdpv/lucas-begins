import React, { useState, useEffect, useRef } from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  Minus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  GripVertical,
  Heading,
  Play,
  Star,
  PlusCircle,
  Columns,
  FileText
} from 'lucide-react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { cn } from '../../lib/utils';
import ImageUpload from '../ui/ImageUpload';

interface Block {
  id: string;
  type: 'heading' | 'text' | 'image' | 'video' | 'divider' | 'pullquote' | 'magazine-row' | 'info-box';
  content: string;
  url?: string;
  layout?: 'full' | 'left' | 'right' | 'columns-2'; 
  useShape?: boolean;
  wrapType?: 'silhouette' | 'circle' | 'diagonal';
  wrapIntensity?: number; 
  wrapDirection?: 'up' | 'down';
}

interface BlockEditorProps {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
}

/**
 * Retro Stage Builder: Editor Visual baseado em Blocos.
 * Converte automaticamente entre Array de Blocos e String Markdown.
 */
export default function BlockEditor({ value, onChange, isDark }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);

  // 1. Parser: Markdown -> Blocks (carrega na inicialização ou quando o valor muda externamente)
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (value && (isFirstRun.current || blocks.length === 0)) {
      const parsed = parseMarkdownToBlocks(value);
      if (parsed.length > 0) {
        setBlocks(parsed);
        isFirstRun.current = false;
      }
    } else if (!value && isFirstRun.current) {
      isFirstRun.current = false;
    }
  }, [value]);

  // 2. Serializer: Blocks -> Markdown
  useEffect(() => {
    const markdown = blocksToMarkdown(blocks);
    // Trava de segurança: só envia a mudança se houver blocos ou se o valor original também estiver vazio
    // Isso evita que o editor zere o texto se os blocos demorarem a carregar
    if (markdown !== value && !isFirstRun.current && (blocks.length > 0 || value === "")) {
      onChange(markdown);
    }
  }, [blocks, value, onChange]);

  // Handlers de Bloco
  const addBlock = (type: Block['type']) => {
    const newBlock: Block = { 
      id: Date.now().toString() + Math.random(), 
      type, 
      content: '', 
      url: (type === 'image' || type === 'video') ? '' : undefined 
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } as Block : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: number) => {
    const newBlocks = [...blocks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  // Lista de Ferramentas Unificada
  const CommandDock = () => {
    const tools = [
      { id: 'heading', icon: <Heading size={20} />, label: "Título" },
      { id: 'text', icon: <FileText size={20} />, label: "Texto" },
      { id: 'pullquote', icon: <Star size={20} />, label: "Frase" },
      { separator: true },
      { id: 'image', icon: <ImageIcon size={20} />, label: "Imagem" },
      { id: 'video', icon: <Play size={20} />, label: "Vídeo" },
      { separator: true },
      { id: 'magazine-row', icon: <Columns size={20} />, label: "Lado a Lado" },
      { id: 'info-box', icon: <PlusCircle size={20} />, label: "Box" },
      { id: 'divider', icon: <Minus size={20} />, label: "Divisor" },
    ];

    return (
      <div className="w-full mb-6">
        <div className={cn(
          "w-full px-6 rounded-[2.5rem] border-2 border-dashed transition-all",
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
        )}>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
            <ToolbarButton onClick={() => addBlock('heading')} icon={<Heading size={22} />} label="Título" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('text')} icon={<FileText size={22} />} label="Texto" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('pullquote')} icon={<Star size={22} />} label="Frase" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('image')} icon={<ImageIcon size={22} />} label="Imagem" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('video')} icon={<Play size={22} />} label="Vídeo" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('magazine-row')} icon={<Columns size={22} />} label="Lado a Lado" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('info-box')} icon={<PlusCircle size={22} />} label="Box" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('divider')} icon={<Minus size={22} />} label="Divisor" isDark={isDark} />
          </div>
        </div>
      </div>
    );
  };



  if (blocks.length === 0 && !value) {
    return (
      <div className={cn(
        "p-12 md:p-24 border-2 border-dashed rounded-[3rem] text-center transition-all flex flex-col items-center justify-center gap-10",
        isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
      )}>
        <p className="font-retro text-2xl md:text-3xl opacity-30 uppercase tracking-[0.2em] max-w-xl leading-relaxed">
          O Palco está vazio. Comece a montar sua fase!
        </p>
        <div className="w-full max-w-5xl">
          <CommandDock />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Reorder.Group 
        axis="y" 
        values={blocks} 
        onReorder={setBlocks} 
        className="space-y-10"
      >
        {blocks.map((block, idx) => (
          <BlockItem 
            key={block.id}
            block={block}
            idx={idx}
            blocks={blocks}
            isDark={isDark}
            updateBlock={updateBlock}
            removeBlock={removeBlock}
            moveBlock={moveBlock}
          />
        ))}
      </Reorder.Group>

      <div className="w-full">
        <CommandDock />
      </div>
    </div>
  );
}

// Sub-componente para cada item da lista (necessário para useDragControls)
interface BlockItemProps {
  block: Block;
  idx: number;
  blocks: Block[];
  isDark: boolean;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (index: number, direction: number) => void;
}

function BlockItem({ block, idx, blocks, isDark, updateBlock, removeBlock, moveBlock }: BlockItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item 
      value={block}
      dragListener={false}
      dragControls={dragControls}
      className="relative"
    >
      <div className={cn(
        "group relative p-6 rounded-2xl border-2 transition-all duration-300",
        isDark ? "bg-gray-800 border-gray-700 hover:border-purple-500" : "bg-white border-gray-200 hover:border-black"
      )}>
        {/* Controles do Bloco (Barra Flutuante Superior) */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-all z-30 scale-90 group-hover:scale-100 bg-white dark:bg-gray-800">
          <ControlButton onClick={() => moveBlock(idx, -1)} icon={<ArrowUp size={14} />} isDark={isDark} disabled={idx === 0} />
          <ControlButton onClick={() => moveBlock(idx, 1)} icon={<ArrowDown size={14} />} isDark={isDark} disabled={idx === blocks.length - 1} />
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
          <ControlButton onClick={() => removeBlock(block.id)} icon={<Trash2 size={14} />} isDark={isDark} variant="danger" />
        </div>

        {/* Conteúdo do Bloco */}
        <div className="flex gap-4">
          <div 
            onPointerDown={(e) => dragControls.start(e)}
            className="mt-1 opacity-30 cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity flex items-center"
          >
            <GripVertical size={20} />
          </div>
          
          <div className="flex-1">
            {block.type === 'heading' && (
              <input 
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Título da Seção..."
                className={cn(
                  "w-full bg-transparent font-retro text-2xl font-bold uppercase outline-none focus:text-purple-500 transition-colors",
                  isDark ? "text-white" : "text-black"
                )}
              />
            )}

            {block.type === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/5">
                  <span className="font-retro text-[10px] font-bold uppercase text-purple-400/50 tracking-widest">Diagramação</span>
                  <div className="flex p-1 rounded-xl bg-black/40 border border-white/10">
                    <button 
                      type="button"
                      onClick={() => updateBlock(block.id, { layout: 'full' })}
                      className={cn(
                        "px-6 py-2 text-[9px] font-retro font-bold uppercase rounded-lg transition-all", 
                        block.layout === 'full' ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                      )}
                    >Padrão</button>
                    <button 
                      type="button"
                      onClick={() => updateBlock(block.id, { layout: 'columns-2' })}
                      className={cn(
                        "px-6 py-2 text-[9px] font-retro font-bold uppercase rounded-lg transition-all", 
                        block.layout === 'columns-2' ? "bg-purple-600 text-white" : "text-gray-500 hover:text-gray-300"
                      )}
                    >Revista</button>
                  </div>
                </div>

                <div className="relative group max-w-full overflow-hidden">
                  <textarea 
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    placeholder="Escreva seu texto aqui..."
                    className={cn(
                      "w-full bg-black/20 outline-none p-8 text-lg leading-relaxed font-medium rounded-2xl border-2 border-transparent focus:border-purple-500/20 transition-all min-h-[150px] resize-y",
                      "break-all whitespace-pre-wrap overflow-wrap-anywhere",
                      isDark ? "text-gray-300" : "text-gray-800"
                    )}
                  />
                </div>

                {/* Simulador Editorial de Texto - Estilo Luxo */}
                {block.layout === 'columns-2' && block.content && (
                  <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700 w-full max-w-full overflow-hidden">
                    <div className="flex items-center gap-3 px-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                      <span className="font-retro text-[8px] font-bold uppercase text-purple-400 tracking-[0.3em]">Studio Editorial</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                    </div>
                    
                    <div className={cn(
                      "relative rounded-[2rem] border-2 border-black shadow-[12px_12px_0px_rgba(0,0,0,0.4)] overflow-hidden transition-all w-full max-w-full",
                      "bg-[#f4f1ea]" 
                    )}>
                      {/* Textura de Grão de Papel */}
                      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" 
                           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
                      
                      {/* Grid de Design */}
                      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                      
                      <div className="relative p-10 md:p-12">
                        <div className="text-[12px] leading-[1.8] text-gray-900 font-serif text-justify md:columns-2 gap-12 break-all overflow-wrap-anywhere">
                          <span className="float-left text-[85px] font-bold leading-[0.7] mr-5 mt-2 text-black font-retro select-none">
                            {block.content.trim().charAt(0).toUpperCase()}
                          </span>
                          {block.content.trim().slice(1)}
                        </div>
                      </div>

                      {/* Selo de Qualidade Editorial */}
                      <div className="absolute bottom-4 right-6 opacity-20">
                        <span className="font-retro text-[7px] font-bold uppercase tracking-widest text-black">Begins Editorial System v2.0</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {block.type === 'image' && (
              <div className="space-y-8">
                <div className="bg-black/30 p-6 rounded-3xl border border-white/10 space-y-8">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-retro font-bold uppercase text-purple-400 tracking-widest">Alinhamento Editorial</span>
                    <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-black/40 border border-white/10">
                      {[
                        { id: 'full', label: 'Centralizado' },
                        { id: 'left', label: 'Esquerda (Wrap)' },
                        { id: 'right', label: 'Direita (Wrap)' }
                      ].map((l) => (
                        <button 
                          key={l.id}
                          type="button"
                          onClick={() => updateBlock(block.id, { layout: l.id as any })}
                          className={cn(
                            "py-4 text-[11px] font-retro font-bold uppercase rounded-xl transition-all", 
                            (block.layout || 'full') === l.id ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "text-gray-500 hover:text-gray-300"
                          )}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 p-6 rounded-2xl border-2 border-purple-500/30 bg-purple-500/5 shadow-xl">
                    <div className="flex items-center gap-4">
                       <div className="relative w-8 h-8">
                         <input 
                           type="checkbox" 
                           id={`shape-${block.id}`}
                           checked={block.useShape || false}
                           onChange={(e) => updateBlock(block.id, { useShape: e.target.checked })}
                           className="w-8 h-8 rounded-lg accent-purple-600 cursor-pointer opacity-0 absolute inset-0 z-10"
                         />
                         <div className={cn(
                           "w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all",
                           block.useShape ? "bg-purple-600 border-purple-400" : "bg-black/40 border-white/20"
                         )}>
                           {block.useShape && <Star size={16} className="text-white fill-white" />}
                         </div>
                       </div>
                       <label htmlFor={`shape-${block.id}`} className="font-retro text-base font-bold uppercase cursor-pointer select-none text-purple-300">
                         Ativar Efeito de Contorno (Magazine Style)
                       </label>
                    </div>

                        {block.useShape && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                              {[
                                { id: 'silhouette', label: 'Padrão (Reto)', desc: 'O texto respeita o box' },
                                { id: 'circle', label: 'Círculo', desc: 'Máscara arredondada' },
                                { id: 'diagonal', label: 'Diagonal', desc: 'Corte inclinado' }
                              ].map((t) => (
                                <button 
                                  key={t.id}
                                  type="button"
                                  onClick={() => updateBlock(block.id, { wrapType: t.id as any })}
                                  className={cn(
                                    "flex flex-col items-center p-6 rounded-2xl border-2 transition-all text-center gap-3",
                                    (block.wrapType || 'silhouette') === t.id 
                                      ? "bg-purple-600 border-purple-300 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] scale-105 z-10" 
                                      : "bg-black/30 border-white/5 text-gray-500 hover:border-purple-500/40"
                                  )}
                                >
                                  <span className="font-retro text-sm font-bold uppercase tracking-wider">{t.label}</span>
                                  <span className="text-[11px] opacity-70 leading-relaxed font-medium">{t.desc}</span>
                                </button>
                              ))}
                            </div>

                            {block.wrapType && block.wrapType !== 'silhouette' && (
                              <div className="mt-6 space-y-3 bg-black/30 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center">
                                  <span className="font-retro text-[10px] font-bold uppercase text-purple-400">Intensidade do Recorte</span>
                                  <span className="text-xs font-mono text-purple-400">{(block.wrapIntensity || 50)}%</span>
                                </div>
                                <input 
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={block.wrapIntensity || 50}
                                  onChange={(e) => updateBlock(block.id, { wrapIntensity: parseInt(e.target.value) })}
                                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <p className="text-[9px] opacity-40 italic">
                                  {block.wrapType === 'circle' ? "Ajusta o tamanho do círculo" : "Ajusta o ângulo da inclinação"}
                                </p>
                              </div>
                            )}

                            {block.wrapType === 'diagonal' && (
                              <div className="mt-4 flex p-1 rounded-xl bg-black/40 border border-white/10">
                                <button 
                                  type="button"
                                  onClick={() => updateBlock(block.id, { wrapDirection: 'up' })}
                                  className={cn("flex-1 py-2 text-[9px] font-retro font-bold uppercase rounded-lg transition-all", (block.wrapDirection || 'up') === 'up' ? "bg-blue-600 text-white" : "text-gray-500")}
                                >Inclinar Topo</button>
                                <button 
                                  type="button"
                                  onClick={() => updateBlock(block.id, { wrapDirection: 'down' })}
                                  className={cn("flex-1 py-2 text-[9px] font-retro font-bold uppercase rounded-lg transition-all", block.wrapDirection === 'down' ? "bg-blue-600 text-white" : "text-gray-500")}
                                >Inclinar Base</button>
                              </div>
                            )}

                                    {/* Mini Simulador de Revista - Redesenhado */}
                            <div className="mt-8 space-y-4">
                              <div className="flex items-center justify-between px-2">
                                <span className="font-retro text-[10px] font-bold uppercase text-purple-400 tracking-[0.2em]">Estúdio Editorial</span>
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                  <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                                  <div className="w-2 h-2 rounded-full bg-green-500/40" />
                                </div>
                              </div>
                              
                              <div className={cn(
                                "relative rounded-3xl border-2 border-black shadow-[12px_12px_0px_rgba(0,0,0,0.3)] overflow-hidden min-h-[280px] transition-all",
                                isDark ? "bg-[#fdfbf7]" : "bg-white"
                              )}>
                                {/* Grid de Design */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                     style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                
                                <div className="relative p-8">
                                  {block.url && (
                                    <img 
                                      src={block.url}
                                      alt="Preview"
                                      className={cn(
                                        "transition-all duration-500 ease-in-out",
                                        (block.layout === 'left' || block.layout === 'full') ? "float-left mr-6" : "float-right ml-6"
                                      )}
                                      style={{
                                        width: '45%',
                                        height: 'auto',
                                        maxHeight: '220px',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                                        shapeOutside: block.wrapType === 'circle' 
                                          ? `circle(${(block.wrapIntensity || 50)}%)` 
                                          : block.wrapType === 'diagonal'
                                            ? (block.layout === 'right' 
                                                ? ((block.wrapDirection === 'down') 
                                                  ? `polygon(0% 0%, 100% 0%, 100% 100%, ${(block.wrapIntensity || 50)}% 100%)`
                                                  : `polygon(${(block.wrapIntensity || 50)}% 0%, 100% 0%, 100% 100%, 0% 100%)`)
                                                : ((block.wrapDirection === 'down')
                                                  ? `polygon(0% 0%, ${100 - (block.wrapIntensity || 50)}% 0%, 100% 100%, 0% 100%)`
                                                  : `polygon(0% 0%, 100% 0%, ${100 - (block.wrapIntensity || 50)}% 100%, 0% 100%)`))
                                            : 'none',
                                        clipPath: block.wrapType === 'circle' 
                                          ? `circle(${(block.wrapIntensity || 50)}%)` 
                                          : block.wrapType === 'diagonal'
                                            ? (block.layout === 'right' 
                                                ? ((block.wrapDirection === 'down') 
                                                  ? `polygon(0% 0%, 100% 0%, 100% 100%, ${(block.wrapIntensity || 50)}% 100%)`
                                                  : `polygon(${(block.wrapIntensity || 50)}% 0%, 100% 0%, 100% 100%, 0% 100%)`)
                                                : ((block.wrapDirection === 'down')
                                                  ? `polygon(0% 0%, ${100 - (block.wrapIntensity || 50)}% 0%, 100% 100%, 0% 100%)`
                                                  : `polygon(0% 0%, 100% 0%, ${100 - (block.wrapIntensity || 50)}% 100%, 0% 100%)`))
                                            : 'none'
                                      }}
                                    />
                                  )}
                                  
                                  <div className="text-[9px] leading-[1.8] text-gray-700 font-serif text-justify">
                                    <span className="float-left text-4xl font-bold leading-[0.8] mr-2 mt-1 text-purple-600 font-retro">A</span>
                                    diagramação editorial de uma revista de games clássica exige que o texto flua de forma orgânica ao redor das artes e dos screenshots dos jogos. Este simulador permite que você visualize o "feeling" da página antes mesmo de publicar. Cada ajuste na intensidade ou na direção do corte diagonal cria um ritmo visual único para o seu post. Sinta a liberdade de experimentar ângulos agressivos ou curvas suaves para destacar seus heróis favoritos. A harmonia entre imagem e texto é o segredo de um artigo que engaja o leitor do início ao fim.
                                  </div>
                                  <div className="clear-both" />
                                </div>
                              </div>
                              <p className="text-[8px] text-center opacity-40 font-bold uppercase tracking-widest italic">
                                * Pressione "Preview" no topo para visualizar com o texto real do post
                              </p>
                            </div>
                          </>
                        )}
                  </div>
                </div>

                <div className={cn(
                  "transition-all duration-500 border-4 border-dashed border-white/5 rounded-3xl p-4 bg-black/20",
                  block.layout === 'left' && "w-1/2 float-left mr-8",
                  block.layout === 'right' && "w-1/2 float-right ml-8"
                )}>
                  <ImageUpload 
                    label="Upload da Imagem"
                    initialValue={block.url || ""}
                    onUploadComplete={(url) => updateBlock(block.id, { url })}
                    folder="posts/content"
                    aspect={ (block.layout === 'full' || !block.layout) ? 16/9 : 1 }
                  />
                  <input 
                    type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    placeholder="Adicione uma legenda aqui..."
                    className="w-full bg-transparent outline-none text-sm italic opacity-50 mt-4 text-center"
                  />
                </div>
              </div>
            )}

            {block.type === 'info-box' && (
              <div className={cn(
                "p-6 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] relative",
                isDark ? "bg-blue-900/20" : "bg-yellow-50"
              )}>
                <div className="absolute -top-4 left-4 bg-black text-white px-3 py-1 font-retro text-[10px] font-bold uppercase">Box de Informação</div>
                <textarea 
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder="Dados técnicos, dicas, curiosidades..."
                  rows={4}
                  className="w-full bg-transparent outline-none font-medium leading-relaxed"
                />
              </div>
            )}

            {block.type === 'pullquote' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-500 font-retro text-[10px] font-bold uppercase tracking-widest">
                  <Star size={14} className="fill-yellow-500" /> Frase em Destaque (Olho)
                </div>
                <textarea 
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder="DIGITE AQUI AQUELA FRASE DE EFEITO..."
                  rows={2}
                  className={cn(
                    "w-full bg-transparent outline-none resize-none font-retro text-2xl font-bold italic border-l-8 pl-4 transition-all",
                    isDark ? "text-purple-300 border-purple-500" : "text-purple-700 border-purple-400"
                  )}
                />
              </div>
            )}

            {block.type === 'magazine-row' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-500 font-retro text-[10px] font-bold uppercase tracking-widest">
                    <ImageIcon size={14} /> Layout Revista (Lado a Lado)
                  </div>
                  <div className="flex p-1 rounded-lg bg-black/5 dark:bg-black/40 border border-black/10">
                    <button 
                      type="button"
                      onClick={() => updateBlock(block.id, { layout: 'left' })}
                      className={cn("px-3 py-1 text-[8px] font-retro font-bold uppercase rounded-md transition-all", (block.layout || 'left') === 'left' ? "bg-purple-600 text-white" : "text-gray-500")}
                    >Imagem Esquerda</button>
                    <button 
                      type="button"
                      onClick={() => updateBlock(block.id, { layout: 'right' })}
                      className={cn("px-3 py-1 text-[8px] font-retro font-bold uppercase rounded-md transition-all", block.layout === 'right' ? "bg-purple-600 text-white" : "text-gray-500")}
                    >Imagem Direita</button>
                  </div>
                </div>

                <div className={cn("flex flex-col md:flex-row gap-6", (block.layout === 'right') && "md:flex-row-reverse")}>
                  <div className="flex-1 max-w-[300px]">
                    <ImageUpload 
                      label="Imagem"
                      initialValue={block.url || ""}
                      onUploadComplete={(url) => updateBlock(block.id, { url })}
                      folder="posts/content"
                      aspect={4/3}
                    />
                  </div>
                  <div className="flex-[2] min-w-0 overflow-hidden">
                    <textarea 
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder="Texto que acompanhará a imagem..."
                      rows={6}
                      className={cn(
                        "w-full h-full bg-transparent outline-none resize-none font-medium leading-relaxed break-words",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {block.type === 'video' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/10 dark:bg-black/40 border border-white/5">
                  <Play size={20} className="text-purple-500" />
                  <input 
                    type="url"
                    value={block.url || ''}
                    onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                    placeholder="URL do vídeo do YouTube..."
                    className="flex-1 bg-transparent outline-none text-sm font-mono"
                  />
                </div>
                {block.url && (
                  <div className="relative rounded-none overflow-hidden border-2 border-purple-500/20 aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${block.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1]}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            )}

            {block.type === 'divider' && (
              <div className="py-4 flex items-center gap-4">
                <div className="flex-1 h-1 bg-purple-500/20 rounded-full" />
                <Minus className="text-purple-500" />
                <div className="flex-1 h-1 bg-purple-500/20 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isDark: boolean;
}

function ToolbarButton({ onClick, icon, label, isDark }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 w-full py-6 px-1 rounded-3xl transition-all group border-2 border-transparent",
        isDark 
          ? "hover:bg-purple-500/20 hover:border-purple-500/40 text-gray-400 hover:text-purple-400" 
          : "hover:bg-purple-50 hover:border-purple-200 text-gray-500 hover:text-purple-600"
      )}
    >
      <span className="flex items-center justify-center transition-transform group-hover:scale-125 shrink-0 scale-110">
        {icon}
      </span>
      <span className="font-retro text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap leading-none mt-1">
        {label}
      </span>
    </button>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  isDark: boolean;
  disabled?: boolean;
  variant?: 'danger' | 'default';
}

function ControlButton({ onClick, icon, isDark, disabled, variant }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={cn(
        "p-2 rounded-lg border shadow-sm transition-all disabled:opacity-30",
        isDark 
          ? (variant === 'danger' ? "bg-red-900/50 border-red-500 text-red-500" : "bg-gray-700 border-gray-600 text-white")
          : (variant === 'danger' ? "bg-red-50 border-red-500 text-red-500" : "bg-white border-black text-black")
      )}
    >
      {icon}
    </button>
  );
}

// Lógica de Conversão (Helpers)
function parseMarkdownToBlocks(markdown: string): Block[] {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const blocks: Block[] = [];

  lines.forEach(line => {
    if (line.startsWith('## ')) {
      blocks.push({ id: Math.random().toString(), type: 'heading', content: line.replace('## ', '') });
    } else if (line.startsWith(':::pullquote')) {
      // Começo de pullquote
      blocks.push({ id: 'temp_pq', type: 'pullquote', content: '' });
    } else if (line.startsWith(':::info-box')) {
      blocks.push({ id: 'temp_ib', type: 'info-box', content: '' });
    } else if (line.startsWith(':::columns-2')) {
      blocks.push({ id: 'temp_col', type: 'text', content: '', layout: 'columns-2' });
    } else if (line.startsWith(':::magazine-row')) {
      const match = line.match(/:::magazine-row\((left|right)\)/);
      blocks.push({ id: 'temp_mr', type: 'magazine-row', content: '', url: '', layout: (match?.[1] as 'left' | 'right') || 'left' });
    } else if (line.trim() === ':::') {
      // Fim de bloco especial - não faz nada além de fechar a lógica mental
    } else if (line.startsWith('![')) {
      const match = line.match(/^!\[([^\]]*)\]\(([^)]+?)\)/);
      if (match) {
        const shapeMatch = line.includes('{#shape-true}');
        const layoutMatch = line.match(/\{#layout-(left|right)\}/);
        const wrapMatch = line.match(/\{#wrap-(silhouette|circle|diagonal)\}/);
        const intensityMatch = line.match(/\{#intensity-(\d+)\}/);
        const directionMatch = line.match(/\{#direction-(up|down)\}/);
        
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock && lastBlock.type === 'magazine-row' && !lastBlock.url) {
          lastBlock.url = match[2];
        } else {
          blocks.push({ 
            id: Math.random().toString(), 
            type: 'image', 
            content: match[1] === 'IMAGE' ? '' : match[1], 
            url: match[2],
            layout: (layoutMatch?.[1] as any) || 'full',
            useShape: shapeMatch,
            wrapType: (wrapMatch?.[1] as any) || 'silhouette',
            wrapIntensity: intensityMatch ? parseInt(intensityMatch[1]) : 50,
            wrapDirection: (directionMatch?.[1] as any) || 'up'
          });
        }
      }
    } else if (line.startsWith('@[youtube]')) {
      const match = line.match(/@\[youtube\]\((.*?)\)/);
      if (match) {
        blocks.push({ id: Math.random().toString(), type: 'video', content: '', url: match[1] });
      }
    } else if (line.trim() === '---') {
      blocks.push({ id: Math.random().toString(), type: 'divider', content: '' });
    } else if (line.trim() !== '') {
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock && (lastBlock.type === 'text' || lastBlock.type === 'pullquote' || lastBlock.type === 'magazine-row')) {
        lastBlock.content = lastBlock.content ? lastBlock.content + '\n' + line : line;
      } else {
        blocks.push({ id: Math.random().toString(), type: 'text', content: line });
      }
    }
  });

  // Limpa IDs temporários
  return blocks.map(b => ({ ...b, id: b.id.startsWith('temp') ? Math.random().toString() : b.id }));
}

function blocksToMarkdown(blocks: Block[]): string {
  return blocks.map(b => {
    switch (b.type) {
      case 'heading': return `## ${b.content}`;
      case 'pullquote': return `:::pullquote\n${b.content}\n:::`;
      case 'info-box': return `:::info-box\n${b.content}\n:::`;
      case 'magazine-row': return `:::magazine-row(${b.layout || 'left'})\n![IMAGE](${b.url})\n${b.content}\n:::`;
      case 'image': 
        const layoutSuffix = b.layout && b.layout !== 'full' ? `{#layout-${b.layout}}` : '';
        const shapeSuffix = b.useShape ? `{#shape-true}` : '';
        const wrapSuffix = b.wrapType ? `{#wrap-${b.wrapType}}` : '';
        const intensitySuffix = b.wrapIntensity !== undefined ? `{#intensity-${b.wrapIntensity}}` : '';
        const directionSuffix = b.wrapDirection ? `{#direction-${b.wrapDirection}}` : '';
        return `![${b.content || ''}](${b.url})${layoutSuffix}${shapeSuffix}${wrapSuffix}${intensitySuffix}${directionSuffix}`;
      case 'text':
        const prefix = b.layout === 'columns-2' ? `:::columns-2\n` : '';
        const postfix = b.layout === 'columns-2' ? `\n:::` : '';
        return `${prefix}${b.content}${postfix}`;
      case 'video': return `@[youtube](${b.url})`;
      case 'divider': return '---';
      default: return b.content;
    }
  }).join('\n\n');
}
