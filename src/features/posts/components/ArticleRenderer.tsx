import React, { useState } from "react";
import DOMPurify from "dompurify";
import { cn } from "../../../lib/utils";
import RetroSeparator from "../../../components/ui/RetroSeparator";

interface ArticleImageProps {
  src: string;
  alt: string;
  isDark?: boolean;
  layout?: 'full' | 'left' | 'right';
  useShape?: boolean;
  wrapType?: 'silhouette' | 'circle' | 'diagonal';
  wrapIntensity?: number;
  wrapDirection?: 'up' | 'down';
}

/**
 * Sub-componente para renderizar imagens com tratamento de erro gamificado.
 */
function ArticleImage({ src, alt, isDark, layout = 'full', useShape = false, wrapType = 'silhouette', wrapIntensity = 50, wrapDirection = 'up' }: ArticleImageProps) {
  const [error, setError] = useState(false);

  // MODO RECORTE (MAGAZINE STYLE)
  if (useShape && !error) {
    const getShapeStyle = () => {
      const base = {
        float: layout === 'full' ? 'none' : (layout as any),
        width: '45%',
        maxHeight: '600px',
        objectFit: 'contain' as any,
        margin: layout === 'left' ? '0.5rem 2rem 1.5rem 0' : '0.5rem 0 1.5rem 2rem'
      };

      const intensity = wrapIntensity ?? 50;

      if (wrapType === 'circle') {
        // Intensidade controla o raio (de 10% a 100%)
        const radius = Math.max(10, Math.min(100, intensity));
        return {
          ...base,
          shapeOutside: `circle(${radius}%)`,
          clipPath: `circle(${radius}%)`,
          shapeMargin: '0.5rem',
          margin: layout === 'left' ? '0.2rem 1rem 1rem 0' : '0.2rem 0 1rem 1rem'
        };
      }

      if (wrapType === 'diagonal') {
        const slant = intensity; 
        let poly = "";

        if (layout === 'right') {
          // Imagem na direita, corte no lado esquerdo da imagem
          poly = wrapDirection === 'down' 
            ? `polygon(0% 0%, 100% 0%, 100% 100%, ${slant}% 100%)`
            : `polygon(${slant}% 0%, 100% 0%, 100% 100%, 0% 100%)`;
        } else {
          // Imagem na esquerda, corte no lado direito da imagem
          poly = wrapDirection === 'down'
            ? `polygon(0% 0%, ${100 - slant}% 0%, 100% 100%, 0% 100%)`
            : `polygon(0% 0%, 100% 0%, ${100 - slant}% 100%, 0% 100%)`;
        }

        return {
          ...base,
          shapeOutside: poly,
          clipPath: poly,
          shapeMargin: '0.5rem',
          margin: layout === 'left' ? '0.2rem 1rem 1rem 0' : '0.2rem 0 1rem 1rem'
        };
      }

      // Default: Silhueta (PNG) ou Padrão (Reto)
      return { 
        ...base,
        shapeOutside: `url(${src})`, 
        shapeImageThreshold: 0.5,
        shapeMargin: '0.5rem',
        margin: layout === 'left' ? '0.2rem 1rem 1rem 0' : '0.2rem 0 1rem 1rem'
      };
    };

    return (
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        style={getShapeStyle()}
        className={cn(
          "pixelated animate-in fade-in duration-1000",
          layout === 'full' && "mx-auto block"
        )}
      />
    );
  }

  const containerClass = cn(
    "w-full rounded-none relative overflow-hidden flex items-center justify-center min-h-[200px] retro-card",
    isDark ? "bg-gray-900" : "bg-snes-mid"
  );

  return (
    <figure 
      className={cn(
        "my-8 animate-in fade-in duration-700 relative group",
        layout === 'left' && "magazine-float-left",
        layout === 'right' && "magazine-float-right",
        layout === 'full' && "w-full my-14"
      )}
    >
      <div className={containerClass}>
        {!error ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setError(true)}
            className="w-full h-auto object-cover max-h-[700px] pixelated"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="text-red-500 font-retro text-xl mb-4 animate-pulse bg-black/40 px-4 py-2 rounded border-2 border-red-500">
              ⚠️ RENDER_FAILED_0x77
            </div>
          </div>
        )}
        <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none" />
      </div>
      {alt && !error && (
        <figcaption className={cn("text-center text-[10px] mt-2 font-retro font-bold tracking-widest uppercase", isDark ? "text-purple-400" : "text-purple-600")}>
          ▲ {alt}
        </figcaption>
      )}
    </figure>
  );
}

interface ArticleVideoProps {
  url: string;
  isDark?: boolean;
}

/**
 * Sub-componente para renderizar vídeos do YouTube com fallback gamificado.
 */
function ArticleVideo({ url, isDark }: ArticleVideoProps) {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.*v=))([^&]{11})/)?.[1];

  return (
    <div className={cn(
      "my-14 w-full aspect-video rounded-none overflow-hidden flex items-center justify-center bg-black relative retro-card"
    )}>
      {videoId ? (
        <iframe
          className="w-full h-full relative z-10"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 text-center z-10">
          <div className="text-yellow-500 font-retro text-xl mb-4 animate-pulse bg-black/40 px-4 py-2 rounded border-2 border-yellow-500">
            ⚠️ SIGNAL_LOST_0x13
          </div>
          <p className={cn("font-retro text-sm uppercase tracking-wide max-w-md", isDark ? "text-gray-400" : "text-gray-500")}>
            Sinal de vídeo instável ou link de teletransporte inválido. Verifique se o endereço do YouTube não foi interceptado por piratas espaciais.
          </p>
          <div className="mt-6 w-48 h-2 bg-gray-800 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-yellow-500 animate-[loading_4s_infinite]" style={{ width: '15%' }} />
          </div>
        </div>
      )}
      <div className="absolute inset-0 scanline-overlay opacity-40 pointer-events-none z-20" />
    </div>
  );
}

interface ArticleRendererProps {
  content?: string;
  isDark?: boolean;
}

export default function ArticleRenderer({ content, isDark }: ArticleRendererProps) {
  if (!content) return null;
  const lines = content.split('\n');

  const formatInline = (text: string) => {
    const raw = text
      .replace(/\*\*(.*?)\*\*/g, `<strong class="font-bold text-purple-600 ${isDark ? 'dark:text-purple-400' : ''}">$1</strong>`)
      .replace(/\*(.*?)\*/g, `<em class="italic text-yellow-600 ${isDark ? 'dark:text-yellow-400' : ''}">$1</em>`);
    return DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['strong', 'em'], ALLOWED_ATTR: ['class'] });
  };

  // Primeira passagem: encontrar os índices de primeiro elemento e primeiro parágrafo
  let firstParagraphIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    if (!line.startsWith('## ') && line.trim() !== '---' && !line.match(/^!\[/) && !line.match(/^@\[youtube\]/) && firstParagraphIndex === -1) {
      firstParagraphIndex = i;
      break;
    }
  }

  const renderedLines: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    // 1. Heading
    if (line.startsWith('## ')) {
      renderedLines.push(
        <h2 key={i} className={cn("font-retro font-bold text-2xl md:text-3xl uppercase mt-12 mb-5 pb-3 border-b-2 tracking-wide text-glow-retro", isDark ? 'border-purple-500 text-purple-300' : 'border-purple-400 text-purple-700')}>
          {line.slice(3).trim()}
        </h2>
      );
      i++;
      continue;
    }

    // 2. Divider
    if (line.trim() === '---') {
      renderedLines.push(<RetroSeparator key={i} isDark={isDark} />);
      i++;
      continue;
    }

    // 3. Pull Quote (Olho)
    if (line.startsWith(':::pullquote')) {
      let pullquoteContent = "";
      i++;
      while (i < lines.length && !lines[i].startsWith(':::')) {
        pullquoteContent += lines[i] + "\n";
        i++;
      }
      renderedLines.push(
        <blockquote key={i} className={cn(
          "my-12 p-10 border-l-[16px] italic relative group overflow-hidden retro-card clear-both",
          isDark ? "bg-purple-900/10 border-purple-500" : "bg-purple-50 border-purple-400 shadow-[8px_8px_0_rgba(0,0,0,1)]"
        )}>
          <div className="absolute top-2 left-4 text-8xl opacity-10 font-retro select-none">"</div>
          <p className={cn(
            "font-retro text-3xl md:text-5xl font-bold leading-tight relative z-10 tracking-tighter",
            isDark ? "text-white" : "text-purple-900"
          )}>
            {pullquoteContent.trim()}
          </p>
          <div className="absolute bottom-2 right-4 text-8xl opacity-10 font-retro rotate-180 select-none">"</div>
        </blockquote>
      );
      i++;
      continue;
    }

    // 3.1 Info Box
    if (line.startsWith(':::info-box')) {
      let infoContent = "";
      i++;
      while (i < lines.length && !lines[i].startsWith(':::')) {
        infoContent += lines[i] + "\n";
        i++;
      }
      renderedLines.push(
        <aside key={i} className="magazine-info-box my-12 font-medium leading-relaxed clear-both break-words overflow-hidden">
          <div className="absolute -top-5 left-6 bg-purple-600 text-white px-4 py-1 font-retro text-xs font-bold uppercase border-2 border-black">
            Extra Stage: Info
          </div>
          <div dangerouslySetInnerHTML={{ __html: formatInline(infoContent.trim()) }} />
        </aside>
      );
      i++;
      continue;
    }

    // 3.2 Multi-columns (Magazine Style)
    if (line.startsWith(':::columns-2')) {
      let colContent = "";
      i++;
      while (i < lines.length && !lines[i].startsWith(':::')) {
        colContent += lines[i] + "\n";
        i++;
      }
      renderedLines.push(
        <div key={i} className="magazine-columns-2 my-14 clear-both group/columns break-words">
          {/* O primeiro parágrafo dentro das colunas também ganha a capitular */}
          <div 
            className="leading-loose text-lg md:text-xl font-medium magazine-article"
            dangerouslySetInnerHTML={{ __html: formatInline(colContent.trim()) }}
          />
        </div>
      );
      i++;
      continue;
    }

    // 4. Magazine Row (Side-by-side legacy support)
    if (line.startsWith(':::magazine-row')) {
      const layout = line.includes('(right)') ? 'right' : 'left';
      let rowImage: { src: string, alt: string } | null = null;
      let rowText = "";
      
      i++;
      while (i < lines.length && !lines[i].startsWith(':::')) {
        const imgMatch = lines[i].match(/^!\[([^\]]*)\]\((.+?)\)$/);
        if (imgMatch) {
          rowImage = { src: imgMatch[2], alt: imgMatch[1] };
        } else {
          rowText += lines[i] + "\n";
        }
        i++;
      }

      renderedLines.push(
        <div key={i} className={cn(
          "my-12 flex flex-col md:flex-row gap-10 items-center clear-both",
          layout === 'right' && "md:flex-row-reverse"
        )}>
          {rowImage && (
            <div className="w-full md:w-[45%] shrink-0">
              <ArticleImage src={rowImage.src} alt={rowImage.alt} isDark={isDark} />
            </div>
          )}
          <div className="flex-1 min-w-0 overflow-hidden">
            <p 
              className="leading-loose text-lg md:text-xl font-medium break-words"
              dangerouslySetInnerHTML={{ __html: formatInline(rowText.trim()) }}
            />
          </div>
        </div>
      );
      i++;
      continue;
    }

    // 5. Image with Optional Float and Shape
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+?)\)/);
    if (imgMatch) {
      const isShape = line.includes('{#shape-true}');
      const layoutMatch = line.match(/\{#layout-(left|right)\}/);
      const wrapMatch = line.match(/\{#wrap-(silhouette|circle|diagonal)\}/);
      const intensityMatch = line.match(/\{#intensity-(\d+)\}/);
      const directionMatch = line.match(/\{#direction-(up|down)\}/);
      
      renderedLines.push(
        <ArticleImage 
          key={i} 
          src={imgMatch[2]} 
          alt={imgMatch[1] === 'IMAGE' ? '' : imgMatch[1]} 
          isDark={isDark} 
          layout={(layoutMatch?.[1] as any) || 'full'} 
          useShape={isShape}
          wrapType={(wrapMatch?.[1] as any) || 'silhouette'}
          wrapIntensity={intensityMatch ? parseInt(intensityMatch[1]) : 50}
          wrapDirection={(directionMatch?.[1] as any) || 'up'}
        />
      );
      i++;
      continue;
    }

    // 6. Video
    const videoMatch = line.match(/^@\[youtube\]\((.*?)\)$/);
    if (videoMatch) {
      renderedLines.push(<ArticleVideo key={i} url={videoMatch[1]} isDark={isDark} />);
      i++;
      continue;
    }

    if (line.startsWith('@[youtube]')) {
      i++;
      continue;
    }

    // 7. Regular Paragraph
    const isFirst = i === firstParagraphIndex;
    renderedLines.push(
      <p
        key={i}
        className={cn("mb-6 leading-loose text-lg md:text-xl font-medium break-words", isFirst && 'magazine-article')}
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
    i++;
  }

  return <>{renderedLines}</>;
}
