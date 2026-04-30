import React, { useState } from "react";
import { cn } from "../../lib/utils";

/**
 * Sub-componente para renderizar imagens com tratamento de erro gamificado.
 */
function ArticleImage({ src, alt, isDark }) {
  const [error, setError] = useState(false);

  return (
    <figure className="my-14 w-full animate-in fade-in duration-700 relative group">
      <div className={cn(
        "w-full rounded-2xl border-4 relative overflow-hidden flex items-center justify-center min-h-[300px]",
        isDark 
          ? "border-purple-500 shadow-[8px_8px_0px_rgba(168,85,247,0.4)] bg-gray-900" 
          : "border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-gray-100"
      )}>
        {!error ? (
          <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            className="w-full h-auto object-cover max-h-[700px]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="text-red-500 font-retro text-xl mb-4 animate-pulse bg-black/40 px-4 py-2 rounded border-2 border-red-500">
              ⚠️ RENDER_FAILED_0x77
            </div>
            <p className={cn("font-retro text-sm uppercase tracking-wide max-w-md", isDark ? "text-gray-400" : "text-gray-600")}>
              Falha na descompressão de assets. O Buffer de vídeo no Setor 4 parou de responder. Tentando reconectar aos servidores de pixel...
            </p>
            <div className="mt-6 w-48 h-2 bg-gray-800 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-red-500 animate-[loading_3s_infinite]" style={{ width: '45%' }} />
            </div>
          </div>
        )}
        <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none" />
      </div>
      {alt && !error && (
        <figcaption className={cn("text-center text-sm mt-5 font-retro font-bold tracking-widest uppercase", isDark ? "text-purple-400" : "text-purple-600")}>
          ▲ {alt}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Sub-componente para renderizar vídeos do YouTube com fallback gamificado.
 */
function ArticleVideo({ url, isDark }) {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1];

  return (
    <div className={cn(
      "my-14 w-full aspect-video rounded-2xl overflow-hidden border-4 flex items-center justify-center bg-black relative",
      isDark ? "border-purple-500 shadow-[8px_8px_0px_rgba(168,85,247,0.4)]" : "border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]"
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

export default function ArticleRenderer({ content, isDark }) {
  if (!content) return null;
  const lines = content.split('\n');

  const formatInline = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, `<strong class="font-bold text-purple-600 ${isDark ? 'dark:text-purple-400' : ''}">$1</strong>`)
      .replace(/\*(.*?)\*/g, `<em class="italic text-yellow-600 ${isDark ? 'dark:text-yellow-400' : ''}">$1</em>`);

  let firstElementRendered = false;
  let firstParagraphRendered = false;

  return (
    <>
      {lines.map((line, index) => {
        if (!line.trim()) return null;

        if (line.startsWith('## ')) {
          const headingText = line.slice(3).trim();
          firstElementRendered = true;
          return (
            <h2 key={index} className={cn("font-retro font-bold text-2xl md:text-3xl uppercase mt-12 mb-5 pb-3 border-b-2 tracking-wide", isDark ? 'border-purple-500 text-purple-300' : 'border-purple-400 text-purple-700')}>
              {headingText}
            </h2>
          );
        }

        if (line.trim() === '---') {
          firstElementRendered = true;
          return (
            <div key={index} className="my-12 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
              <span className={cn("font-retro text-lg opacity-50", isDark ? 'text-purple-400' : 'text-purple-500')}>✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
            </div>
          );
        }

        const imgMatch = line.match(/^!\[([^\]]*)\]\((.+?)\)$/);
        if (imgMatch) {
          firstElementRendered = true;
          return <ArticleImage key={index} src={imgMatch[2]} alt={imgMatch[1]} isDark={isDark} />;
        }

        const videoMatch = line.match(/^@\[youtube\]\((.*?)\)$/);
        if (videoMatch) {
          firstElementRendered = true;
          return <ArticleVideo key={index} url={videoMatch[1]} isDark={isDark} />;
        }

        if (line.startsWith('@[youtube]')) return null;

        const isFirst = !firstParagraphRendered && !firstElementRendered;
        firstParagraphRendered = true;
        firstElementRendered = true;

        return (
          <p
            key={index}
            className={cn("mb-6 leading-loose text-lg md:text-xl font-medium", isFirst && 'magazine-article')}
            dangerouslySetInnerHTML={{ __html: formatInline(line) }}
          />
        );
      }).filter(Boolean)}
    </>
  );
}
