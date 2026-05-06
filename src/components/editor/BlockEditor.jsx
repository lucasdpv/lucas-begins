import React, { useState, useEffect } from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  Minus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  PlusCircle,
  GripVertical,
  Heading,
  Play
} from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Retro Stage Builder: Editor Visual baseado em Blocos.
 * Converte automaticamente entre Array de Blocos e String Markdown.
 */
export default function BlockEditor({ value, onChange, isDark }) {
  const [blocks, setBlocks] = useState([]);

  // 1. Parser: Markdown -> Blocks (carrega apenas na inicialização)
  const isFirstRun = React.useRef(true);
  useEffect(() => {
    if (isFirstRun.current && value && blocks.length === 0) {
      setBlocks(parseMarkdownToBlocks(value));
      isFirstRun.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // 2. Serializer: Blocks -> Markdown
  useEffect(() => {
    const markdown = blocksToMarkdown(blocks);
    if (markdown !== value) {
      onChange(markdown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  // Handlers de Bloco
  const addBlock = (type) => {
    const newBlock = { 
      id: Date.now().toString() + Math.random(), 
      type, 
      content: '', 
      url: (type === 'image' || type === 'video') ? '' : undefined 
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  if (blocks.length === 0 && !value) {
    return (
      <div className={cn(
        "p-12 border-4 border-dashed rounded-3xl text-center transition-all",
        isDark ? "border-gray-700 bg-gray-900/50" : "border-gray-300 bg-gray-50"
      )}>
        <p className="font-retro text-xl opacity-50 mb-6 uppercase">O Palco está vazio. Comece a montar sua fase!</p>
        <div className="flex flex-wrap justify-center gap-4">
          <ToolbarButton onClick={() => addBlock('heading')} icon={<Heading />} label="Título" isDark={isDark} />
          <ToolbarButton onClick={() => addBlock('text')} icon={<Type />} label="Texto" isDark={isDark} />
          <ToolbarButton onClick={() => addBlock('image')} icon={<ImageIcon />} label="Imagem" isDark={isDark} />
          <ToolbarButton onClick={() => addBlock('video')} icon={<Play />} label="Vídeo" isDark={isDark} />
          <ToolbarButton onClick={() => addBlock('divider')} icon={<Minus />} label="Divisor" isDark={isDark} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => (
        <div 
          key={block.id} 
          className={cn(
            "group relative p-6 rounded-2xl border-2 transition-all animate-in slide-in-from-bottom-2 duration-300",
            isDark ? "bg-gray-800 border-gray-700 hover:border-purple-500" : "bg-white border-gray-200 hover:border-black"
          )}
        >
          {/* Controles do Bloco */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ControlButton onClick={() => moveBlock(idx, -1)} icon={<ArrowUp size={16} />} isDark={isDark} disabled={idx === 0} />
            <ControlButton onClick={() => moveBlock(idx, 1)} icon={<ArrowDown size={16} />} isDark={isDark} disabled={idx === blocks.length - 1} />
          </div>

          <div className="absolute -right-4 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ControlButton onClick={() => removeBlock(block.id)} icon={<Trash2 size={16} />} isDark={isDark} variant="danger" />
          </div>

          {/* Conteúdo do Bloco */}
          <div className="flex gap-4">
            <div className="mt-1 opacity-30 cursor-grab active:cursor-grabbing">
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
                <textarea 
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder="Escreva seu texto aqui... (Suporta Markdown simples)"
                  rows={4}
                  className={cn(
                    "w-full bg-transparent outline-none resize-none font-medium leading-relaxed",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}
                />
              )}

              {block.type === 'image' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/10 dark:bg-black/40 border border-white/5">
                    <ImageIcon size={20} className="text-purple-500" />
                    <input 
                      type="url"
                      value={block.url}
                      onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                      placeholder="URL da Imagem..."
                      className="flex-1 bg-transparent outline-none text-sm font-mono"
                    />
                  </div>
                  {block.url && (
                    <div className="relative rounded-none overflow-hidden border-2 border-purple-500/20">
                      <img src={block.url} alt="Preview" className="w-full h-auto max-h-80 object-contain bg-black/20" />
                    </div>
                  )}
                  <input 
                    type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    placeholder="Legenda da imagem (opcional)..."
                    className="w-full bg-transparent outline-none text-xs italic opacity-60"
                  />
                </div>
              )}

              {block.type === 'video' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/10 dark:bg-black/40 border border-white/5">
                    <Play size={20} className="text-purple-500" />
                    <input 
                      type="url"
                      value={block.url}
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
      ))}

      {/* Toolbar Inferior */}
      <div className={cn(
        "flex flex-wrap items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed transition-all",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
      )}>
        <ToolbarButton onClick={() => addBlock('heading')} icon={<Heading size={18} />} label="Título" isDark={isDark} small />
        <ToolbarButton onClick={() => addBlock('text')} icon={<Type size={18} />} label="Texto" isDark={isDark} small />
        <ToolbarButton onClick={() => addBlock('image')} icon={<ImageIcon size={18} />} label="Imagem" isDark={isDark} small />
        <ToolbarButton onClick={() => addBlock('video')} icon={<Play size={18} />} label="Vídeo" isDark={isDark} small />
        <ToolbarButton onClick={() => addBlock('divider')} icon={<Minus size={18} />} label="Divisor" isDark={isDark} small />
      </div>
    </div>
  );
}

// Componentes Auxiliares Internos
function ToolbarButton({ onClick, icon, label, isDark, small }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-2 rounded-xl font-retro font-bold uppercase transition-all retro-button",
        small ? "px-4 py-2 text-xs" : "px-6 py-4 text-sm",
        isDark ? "bg-gray-800 border-gray-600 text-purple-400" : "bg-white border-black text-black"
      )}
    >
      {icon} {label}
    </button>
  );
}

function ControlButton({ onClick, icon, isDark, disabled, variant }) {
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
function parseMarkdownToBlocks(markdown) {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const blocks = [];

  lines.forEach(line => {
    if (line.startsWith('## ')) {
      blocks.push({ id: Math.random().toString(), type: 'heading', content: line.replace('## ', '') });
    } else if (line.startsWith('![')) {
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        blocks.push({ id: Math.random().toString(), type: 'image', content: match[1], url: match[2] });
      }
    } else if (line.startsWith('@[youtube]')) {
      const match = line.match(/@\[youtube\]\((.*?)\)/);
      if (match) {
        blocks.push({ id: Math.random().toString(), type: 'video', url: match[1] });
      }
    } else if (line.trim() === '---') {
      blocks.push({ id: Math.random().toString(), type: 'divider' });
    } else if (line.trim() !== '') {
      // Agrupar linhas consecutivas de texto
      if (blocks.length > 0 && blocks[blocks.length - 1].type === 'text') {
        blocks[blocks.length - 1].content += '\n' + line;
      } else {
        blocks.push({ id: Math.random().toString(), type: 'text', content: line });
      }
    }
  });

  return blocks;
}

function blocksToMarkdown(blocks) {
  return blocks.map(b => {
    switch (b.type) {
      case 'heading': return `## ${b.content}`;
      case 'image': return `![${b.content || ''}](${b.url})`;
      case 'video': return `@[youtube](${b.url})`;
      case 'divider': return '---';
      case 'text': return b.content;
      default: return '';
    }
  }).join('\n\n');
}
