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
  type: 'heading' | 'text' | 'image' | 'video' | 'divider' | 'pullquote' | 'info-box';
  content: string;
  url?: string;
  title?: string;
  author?: string;
  layout?: 'full' | 'left' | 'right'; 
  useShape?: boolean;
  wrapType?: 'silhouette' | 'circle' | 'diagonal';
  wrapIntensity?: number; 
  wrapDirection?: 'up' | 'down';
  aspect?: 'original' | '1:1' | '16:9' | '4:5';
  frameStyle?: 'normal' | 'crt' | 'sticker' | 'none';
  scanlines?: boolean;
  originalUrl?: string;
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
  const [hasInitialized, setHasInitialized] = useState(false);
  const isFirstRun = useRef(true);

  // 1. Parser: Markdown -> Blocks
  useEffect(() => {
    if (isFirstRun.current) {
      if (value) {
        const parsed = parseMarkdownToBlocks(value);
        setBlocks(parsed);
      }
      setHasInitialized(true);
      isFirstRun.current = false;
    }
  }, [value]);

  // 2. Serializer: Blocks -> Markdown
  useEffect(() => {
    if (!hasInitialized) return;

    const markdown = blocksToMarkdown(blocks);
    if (markdown !== value) {
      onChange(markdown);
    }
  }, [blocks, value, onChange, hasInitialized]);

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
    return (
      <div className="w-full">
        <div className={cn(
          "w-full px-4 py-2 rounded-2xl border-2 border-dashed transition-all",
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
        )}>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <ToolbarButton onClick={() => addBlock('heading')} icon={<Heading size={18} />} label="Título" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('text')} icon={<FileText size={18} />} label="Texto" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('pullquote')} icon={<Star size={18} />} label="Frase" isDark={isDark} />
            <div className="w-px h-8 bg-white/10 mx-1 hidden md:block" />
            <ToolbarButton onClick={() => addBlock('image')} icon={<ImageIcon size={18} />} label="Imagem" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('video')} icon={<Play size={18} />} label="Vídeo" isDark={isDark} />
            <div className="w-px h-8 bg-white/10 mx-1 hidden md:block" />
            <ToolbarButton onClick={() => addBlock('info-box')} icon={<PlusCircle size={18} />} label="Box" isDark={isDark} />
            <ToolbarButton onClick={() => addBlock('divider')} icon={<Minus size={18} />} label="Divisor" isDark={isDark} />
          </div>
        </div>
      </div>
    );
  };



  if (blocks.length === 0 && !value) {
    return (
      <div className={cn(
        "p-8 md:p-10 border-2 border-dashed rounded-2xl text-center transition-all flex flex-col items-center justify-center gap-6 group/stage",
        isDark ? "border-white/5 bg-white/[0.02]" : "border-gray-200 bg-gray-50"
      )}>
        <div className="space-y-2">
          <p className="font-retro text-lg md:text-xl opacity-20 uppercase tracking-[0.4em] group-hover/stage:opacity-40 transition-opacity duration-700">
            Stage Empty
          </p>
          <div className="h-0.5 w-10 bg-purple-500/30 mx-auto rounded-full" />
        </div>
        <div className="w-full max-w-3xl">
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

              </div>
            )}

            {block.type === 'image' && (
              <>
              <div className="space-y-8">
                <div className="bg-black/5 dark:bg-black/30 p-6 rounded-3xl border border-purple-950/10 dark:border-white/10 space-y-8">
                  {/* Alinhamento Editorial */}
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-retro font-bold uppercase text-purple-700 dark:text-purple-400 tracking-widest">Alinhamento Editorial</span>
                    <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/10">
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
                            (block.layout || 'full') === l.id 
                              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                              : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-gray-200"
                          )}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Formato / Proporção */}
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-retro font-bold uppercase text-purple-700 dark:text-purple-400 tracking-widest">Formato / Proporção</span>
                    <div className="grid grid-cols-4 p-1.5 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/10">
                      {[
                        { id: 'original', label: 'Original' },
                        { id: '1:1', label: '1:1 (Quad)' },
                        { id: '16:9', label: '16:9 (Ret)' },
                        { id: '4:5', label: '4:5 (Vert)' }
                      ].map((a) => (
                        <button 
                          key={a.id}
                          type="button"
                          onClick={() => updateBlock(block.id, { aspect: a.id as any })}
                          className={cn(
                            "py-4 text-[10px] font-retro font-bold uppercase rounded-xl transition-all", 
                            (block.aspect || 'original') === a.id 
                              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                              : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-gray-200"
                          )}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estilo da Moldura */}
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-retro font-bold uppercase text-purple-700 dark:text-purple-400 tracking-widest">Estilo da Moldura</span>
                    <div className="grid grid-cols-4 p-1.5 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/10">
                      {[
                        { id: 'normal', label: 'Normal' },
                        { id: 'crt', label: 'CRT Retro' },
                        { id: 'sticker', label: 'Adesivo' },
                        { id: 'none', label: 'Sem Moldura' }
                      ].map((f) => (
                        <button 
                          key={f.id}
                          type="button"
                          onClick={() => updateBlock(block.id, { frameStyle: f.id as any })}
                          className={cn(
                            "py-4 text-[10px] font-retro font-bold uppercase rounded-xl transition-all", 
                            (block.frameStyle || 'normal') === f.id 
                              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                              : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-gray-200"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Efeito Scanlines */}
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={block.scanlines !== false}
                        onChange={(e) => updateBlock(block.id, { scanlines: e.target.checked })}
                        className="hidden"
                      />
                      <div className={cn(
                        "w-6 h-6 border-2 flex items-center justify-center transition-all",
                        block.scanlines !== false
                          ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                          : "bg-black/5 dark:bg-black/30 border-purple-600/40 dark:border-white/10 text-transparent"
                      )}>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-retro font-bold uppercase text-purple-700 dark:text-purple-400 tracking-wider">
                        Efeito Scanlines (CRT Overlay)
                      </span>
                    </label>
                  </div>
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
                  originalUrl={block.originalUrl || ""}
                  onUploadComplete={(url, aspect, originalUrl) => {
                    const updates: Partial<Block> = { url };
                    if (aspect) updates.aspect = aspect;
                    if (originalUrl !== undefined) updates.originalUrl = originalUrl;
                    updateBlock(block.id, updates);
                  }}
                  folder="posts/content"
                  aspect={
                    block.aspect === '1:1' ? 1 :
                    block.aspect === '16:9' ? 16/9 :
                    block.aspect === '4:5' ? 4/5 :
                    'original'
                  }
                />
                <input 
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder="Adicione uma legenda aqui..."
                  className="w-full bg-transparent outline-none text-sm italic opacity-50 mt-4 text-center"
                />
              </div>
              </>
            )}

            {block.type === 'info-box' && (
              <div className={cn(
                "p-6 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] relative pt-10",
                isDark ? "bg-blue-900/20" : "bg-yellow-50"
              )}>
                <div className="absolute -top-4 left-4 flex items-center z-20">
                  <input 
                    type="text"
                    value={block.title || ''}
                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                    placeholder="BOX DE INFORMAÇÃO"
                    className="bg-black text-white px-3 py-1 font-retro text-[10px] font-bold uppercase outline-none border-2 border-black w-fit min-w-[200px] shadow-[4px_4px_0px_#6b21a8] placeholder:text-gray-500"
                  />
                </div>
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
                <div className={cn(
                  "relative p-6 rounded-2xl border-l-8 transition-all",
                  isDark ? "bg-purple-900/10 border-purple-500" : "bg-purple-50 border-purple-400"
                )}>
                  <textarea 
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    placeholder="DIGITE AQUI AQUELA FRASE DE EFEITO..."
                    rows={2}
                    className={cn(
                      "w-full bg-transparent outline-none resize-none font-retro text-xl font-bold italic",
                      isDark ? "text-purple-300" : "text-purple-700"
                    )}
                  />
                  <div className="mt-2 flex justify-end">
                    <div className="flex items-center gap-2">
                      <span className="font-retro text-[9px] opacity-40 uppercase tracking-tighter">Citado:</span>
                      <input 
                        type="text"
                        value={block.author || ''}
                        onChange={(e) => updateBlock(block.id, { author: e.target.value })}
                        placeholder="Nome do Autor"
                        className={cn(
                          "bg-transparent border-b border-dashed border-current outline-none font-retro text-sm uppercase text-right w-fit min-w-[150px]",
                          isDark ? "text-purple-400/80" : "text-purple-600/80"
                        )}
                      />
                    </div>
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
        "flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all group border-2 border-transparent",
        isDark 
          ? "hover:bg-purple-500/20 hover:border-purple-500/40 text-gray-400 hover:text-purple-400" 
          : "hover:bg-purple-50 hover:border-purple-200 text-gray-500 hover:text-purple-600"
      )}
    >
      <span className="flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
        {icon}
      </span>
      <span className="font-retro text-[9px] font-bold uppercase tracking-widest whitespace-nowrap leading-none">
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

  let isInsideSpecialBlock = false;
  let wasLastLineEmpty = false;

  lines.forEach(line => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith(':::pullquote')) {
      const authorMatch = trimmedLine.match(/\{#author-(.*?)\}/);
      blocks.push({ 
        id: 'temp_pq', 
        type: 'pullquote', 
        content: '',
        author: authorMatch ? authorMatch[1] : undefined
      });
      isInsideSpecialBlock = true;
      wasLastLineEmpty = false;
      return;
    }
    if (trimmedLine.startsWith(':::info-box')) {
      const titleMatch = trimmedLine.match(/\{#title-(.*?)\}/);
      blocks.push({ 
        id: 'temp_ib', 
        type: 'info-box', 
        content: '',
        title: titleMatch ? titleMatch[1] : undefined
      });
      isInsideSpecialBlock = true;
      wasLastLineEmpty = false;
      return;
    }
    if (trimmedLine === ':::') {
      isInsideSpecialBlock = false;
      wasLastLineEmpty = false;
      return;
    }

    if (line.startsWith('## ')) {
      blocks.push({ id: Math.random().toString(), type: 'heading', content: line.replace('## ', '') });
      isInsideSpecialBlock = false;
      wasLastLineEmpty = false;
    } else if (line.startsWith('![')) {
      const match = line.match(/^!\[([^\]]*)\]\(([^)]+?)\)/);
      if (match) {
        const shapeMatch = line.includes('{#shape-true}');
        const layoutMatch = line.match(/\{#layout-(left|right)\}/);
        const wrapMatch = line.match(/\{#wrap-(silhouette|circle|diagonal)\}/);
        const intensityMatch = line.match(/\{#intensity-(\d+)\}/);
        const directionMatch = line.match(/\{#direction-(up|down)\}/);
        const aspectMatch = line.match(/\{#aspect-(original|1:1|16:9|4:5)\}/);
        const frameMatch = line.match(/\{#frame-(normal|crt|sticker|none)\}/);
        const scanlinesMatch = line.includes('{#scanlines-false}');
        const originalMatch = line.match(/\{#original-(.+?)\}/);
        
        blocks.push({ 
          id: Math.random().toString(), 
          type: 'image', 
          content: match[1] === 'IMAGE' ? '' : match[1], 
          url: match[2],
          layout: (layoutMatch?.[1] as any) || 'full',
          useShape: shapeMatch,
          wrapType: (wrapMatch?.[1] as any) || 'silhouette',
          wrapIntensity: intensityMatch ? parseInt(intensityMatch[1]) : 50,
          wrapDirection: (directionMatch?.[1] as any) || 'up',
          aspect: (aspectMatch?.[1] as any) || 'original',
          frameStyle: (frameMatch?.[1] as any) || 'normal',
          scanlines: !scanlinesMatch,
          originalUrl: originalMatch?.[1] || undefined
        });
      }
      isInsideSpecialBlock = false;
      wasLastLineEmpty = false;
    } else if (line.startsWith('@[youtube]')) {
      const match = line.match(/@\[youtube\]\((.*?)\)/);
      if (match) {
        blocks.push({ id: Math.random().toString(), type: 'video', content: '', url: match[1] });
      }
      isInsideSpecialBlock = false;
      wasLastLineEmpty = false;
    } else if (trimmedLine === '---') {
      blocks.push({ id: Math.random().toString(), type: 'divider', content: '' });
      isInsideSpecialBlock = false;
      wasLastLineEmpty = false;
    } else if (trimmedLine === '' && !isInsideSpecialBlock) {
      wasLastLineEmpty = true;
    } else {
      const lastBlock = blocks[blocks.length - 1];
      
      if (isInsideSpecialBlock && lastBlock && (lastBlock.type === 'pullquote' || lastBlock.type === 'info-box')) {
        lastBlock.content = lastBlock.content ? lastBlock.content + '\n' + line : line;
      } 
      else if (trimmedLine !== '') {
        if (lastBlock && lastBlock.type === 'text' && !wasLastLineEmpty) {
           lastBlock.content = lastBlock.content + '\n' + line;
        } else {
           blocks.push({ id: Math.random().toString(), type: 'text', content: line });
        }
      }
      wasLastLineEmpty = false;
    }
  });

  // Limpa IDs temporários
  return blocks.map(b => ({ ...b, id: b.id.startsWith('temp') ? Math.random().toString() : b.id }));
}

function blocksToMarkdown(blocks: Block[]): string {
  return blocks.map(b => {
    switch (b.type) {
      case 'heading': return `## ${b.content}`;
      case 'pullquote': 
        const authorSuffix = b.author ? `{#author-${b.author}}` : '';
        return `:::pullquote${authorSuffix}\n${b.content}\n:::`;
      case 'info-box': 
        const titleSuffix = b.title ? `{#title-${b.title}}` : '';
        return `:::info-box${titleSuffix}\n${b.content}\n:::`;
      case 'image': 
        const layoutSuffix = b.layout && b.layout !== 'full' ? `{#layout-${b.layout}}` : '';
        const shapeSuffix = b.useShape ? `{#shape-true}` : '';
        const wrapSuffix = b.wrapType ? `{#wrap-${b.wrapType}}` : '';
        const intensitySuffix = b.wrapIntensity !== undefined ? `{#intensity-${b.wrapIntensity}}` : '';
        const directionSuffix = b.wrapDirection ? `{#direction-${b.wrapDirection}}` : '';
        const aspectSuffix = b.aspect && b.aspect !== 'original' ? `{#aspect-${b.aspect}}` : '';
        const frameSuffix = b.frameStyle && b.frameStyle !== 'normal' ? `{#frame-${b.frameStyle}}` : '';
        const scanlinesSuffix = b.scanlines === false ? `{#scanlines-false}` : '';
        const originalSuffix = b.originalUrl ? `{#original-${b.originalUrl}}` : '';
        return `![${b.content || ''}](${b.url})${layoutSuffix}${shapeSuffix}${wrapSuffix}${intensitySuffix}${directionSuffix}${aspectSuffix}${frameSuffix}${scanlinesSuffix}${originalSuffix}`;
      case 'text':
        return b.content;
      case 'video': return `@[youtube](${b.url})`;
      case 'divider': return '---';
      default: return b.content;
    }
  }).join('\n\n');
}
