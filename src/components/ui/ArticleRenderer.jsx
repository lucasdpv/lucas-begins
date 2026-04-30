import React from "react";

/**
 * Componente responsável por renderizar o conteúdo do artigo do banco de dados, 
 * formatando Markdown simples (##, ***, ![alt](url)) para HTML estilizado.
 */
export default function ArticleRenderer({ content, isDark }) {
  if (!content) return null;
  const lines = content.split('\n');

  // Aplica bold e italic via dangerouslySetInnerHTML com classes Tailwind explícitas
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

        // ## Heading
        if (line.startsWith('## ')) {
          const headingText = line.slice(3).trim();
          firstElementRendered = true;
          return (
            <h2
              key={index}
              className={`font-retro font-bold text-2xl md:text-3xl uppercase mt-12 mb-5 pb-3 border-b-2 tracking-wide ${
                isDark ? 'border-purple-500 text-purple-300' : 'border-purple-400 text-purple-700'
              }`}
            >
              {headingText}
            </h2>
          );
        }

        // --- Divider
        if (line.trim() === '---') {
          firstElementRendered = true;
          return (
            <div key={index} className="my-12 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
              <span className={`font-retro text-lg ${isDark ? 'text-purple-400' : 'text-purple-500'} opacity-50`}>
                ✦
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
            </div>
          );
        }

        // ![alt](url) — Imagem
        const imgMatch = line.match(/^!\[([^\]]*)\]\((.+?)\)$/);
        if (imgMatch) {
          firstElementRendered = true;
          return (
            <figure key={index} className="my-14 w-full animate-in fade-in duration-700 relative group">
              <img
                src={imgMatch[2]}
                alt={imgMatch[1]}
                className={`w-full rounded-2xl border-4 ${
                  isDark
                    ? 'border-purple-500 shadow-[8px_8px_0px_rgba(168,85,247,0.4)]'
                    : 'border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]'
                } object-cover max-h-[600px]`}
              />
              {imgMatch[1] && (
                <figcaption
                  className={`text-center text-sm mt-5 font-retro font-bold tracking-widest uppercase ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`}
                >
                  ▲ {imgMatch[1]}
                </figcaption>
              )}
            </figure>
          );
        }

        // @[youtube](url) — Vídeo
        const videoMatch = line.match(/^@\[youtube\]\((.*?)\)$/);
        if (videoMatch) {
          const videoId = videoMatch[1].match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1];
          firstElementRendered = true;
          return (
            <div key={index} className="my-14 w-full aspect-video rounded-2xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_rgba(168,85,247,0.4)] bg-black flex items-center justify-center">
              {videoId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-purple-500 font-retro text-center p-4">
                  <p className="text-xl mb-2">🎮 VÍDEO PRONTO PARA O PALCO</p>
                  <p className="text-sm opacity-50 uppercase">Insira uma URL válida do YouTube no editor</p>
                </div>
              )}
            </div>
          );
        }

        // Se a linha começa com @[youtube] mas não bateu no regex completo (ex: está incompleto), 
        // evitamos que seja renderizado como parágrafo de texto comum com drop-cap
        if (line.startsWith('@[youtube]')) {
          return null;
        }

        // Parágrafo
        const isFirst = !firstParagraphRendered && !firstElementRendered;
        firstParagraphRendered = true;
        firstElementRendered = true;

        return (
          <p
            key={index}
            className={`${isFirst ? 'magazine-article' : ''} mb-6 leading-loose text-lg md:text-xl font-medium`}
            dangerouslySetInnerHTML={{ __html: formatInline(line) }}
          />
        );
      }).filter(Boolean)}
    </>
  );
}
