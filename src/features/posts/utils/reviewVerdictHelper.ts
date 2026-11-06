import { Post } from "../schemas";
import { splitTitle } from "../../../lib/utils";

export interface ProsConsResult {
  pros: string[];
  cons: string[];
}

/**
 * Mapa de migração curado a partir da análise real de todas as 8 reviews
 * já publicadas no BeginsProject (garante 100% de fidelidade imediata).
 */
export const CURATED_REVIEWS_BY_ID: Record<string, ProsConsResult> = {
  // 1. Diablo 4: Lord of Hatred
  A4B7Oh8b0gTh0eIgjlQs: {
    pros: [
      "Duas excelentes classes novas: Paladino e Bruxo (Warlock)",
      "Retorno do Cubo Horádrico e adição do Filtro de Loot nativo",
      "Endgame renovado com o modo Echoing Hatred e Planos de Guerra",
      "Desfecho satisfatório para a saga contra Mephisto em Skovos",
    ],
    cons: [
      "Modo de sobrevivência Echoing Hatred pode ser punitivo demais",
      "Retrabalho completo das habilidades exige reaprendizado das classes",
    ],
  },

  // 2. Top Gear (SNES)
  CKzjMHEgn1B4fEVoRAZG: {
    pros: [
      "Jogabilidade imediata e estratégica com pit stops e uso de nitro",
      "Trilha sonora lendária de Barry Leitch que atravessou gerações",
      "Sensação de velocidade fluida sem quedas de taxa de quadros",
      "Multiplayer de sofá imbatível que garante diversão instantânea",
    ],
    cons: [
      "Tela dividida obrigatória mesmo jogando sozinho contra a CPU",
      "Inteligência artificial dos rivais segue trilhos previsíveis",
    ],
  },

  // 3. Turtles in Time (SNES)
  GnPTir795GPX4w6L7Nxn: {
    pros: [
      "Combate generoso e muito satisfatório do início ao fim",
      "Cada uma das quatro tartarugas tem estilo e ritmo próprios",
      "Fases variadas viajando no tempo com identidade e trilha únicas",
      "Port de SNES superior ao arcade com fases e modos extras",
    ],
    cons: [
      "Picos de dificuldade acentuados nas últimas fases",
      "Campanha curta que deixa gosto de quero mais",
    ],
  },

  // 4. Jackie Chan Stuntmaster (PS1)
  J4FIpZIwCIiTyOlSH1VI: {
    pros: [
      "Combate divertido focado no improviso com objetos do cenário",
      "Captura de movimentos e dublagem feitas pelo próprio Jackie Chan",
      "Visual cartunesco carismático que envelheceu muito bem",
      "Segredos e erros de gravação clássicos que incentivam o replay",
    ],
    cons: [
      "Câmera fixa atrapalha o cálculo de pulos nas áreas de plataforma",
      "Campanha principal curta para quem não busca os colecionáveis",
    ],
  },

  // 5. Naruto Ultimate Ninja (PS2)
  WpntcErK86YMxWqJzJqn: {
    pros: [
      "Jutsus cinematográficos e visual 100% fiel ao anime clássico",
      "Arenas em múltiplos planos que deixam as lutas dinâmicas",
      "Quantidade absurda de colecionáveis e segredos para desbloquear",
      "Multiplayer de sofá viciante e acessível para qualquer jogador",
    ],
    cons: [
      "Elenco inicial reduzido por ser o primeiro título da franquia",
      "Modo história curto e focado em poucos arcos",
    ],
  },

  // 6. Lufia and the Fortress of Doom (SNES)
  nMRmCq0ss0baTa5PWLJC: {
    pros: [
      "Abertura histórica começando direto na batalha final contra os Sinistrals",
      "Trilha sonora emocionante e inesquecível de Yasunori Shiono",
      "Personagens carismáticos com papéis bem definidos no grupo",
      "Mundo clássico acolhedor que lançou as bases de uma franquia lendária",
    ],
    cons: [
      "Taxa de batalhas aleatórias muito alta que testa a paciência",
      "Mira teimosa em combate que ataca o vazio se o monstro já caiu",
    ],
  },

  // 7. Chrono Trigger (SNES)
  p76zyPiLGzBL0EvheqB4: {
    pros: [
      "União histórica de Sakaguchi, Yuji Horii e a arte de Akira Toriyama",
      "Trilha sonora lendária de Yasunori Mitsuda e Nobuo Uematsu",
      "Combates dinâmicos direto no mapa sem telas de carregamento",
      "Revolucionou o gênero com o New Game+ e 13 finais diferentes",
    ],
    cons: [
      "Praticamente irretocável; deixa qualquer outro RPG difícil de superar",
    ],
  },

  // 8. Radiata Stories (PS2)
  x3BMiTBALFa1qNfbnrdl: {
    pros: [
      "Cidade viva com ciclo de dia e noite e rotina própria para cada NPC",
      "Impressionantes 176 personagens únicos recrutáveis para o grupo",
      "Escolha dramática na história que divide o jogo em duas campanhas",
      "Humor carismático e a icônica mecânica de chutar tudo para duelar",
    ],
    cons: [
      "Permanece preso no PlayStation 2 sem versão remasterizada oficial",
      "Recrutar certos aliados exige horários muito específicos no relógio",
    ],
  },
};

/**
 * Retorna os Prós e Contras efetivos de um post (prioriza os salvos no banco,
 * ou usa os curados da migração caso o documento ainda não tenha sido re-salvo).
 */
export function resolvePostProsCons(post: Partial<Post>): ProsConsResult {
  const savedPros = (post.pros || []).map((s) => s.trim()).filter(Boolean);
  const savedCons = (post.cons || []).map((s) => s.trim()).filter(Boolean);

  if (savedPros.length > 0 || savedCons.length > 0) {
    return { pros: savedPros, cons: savedCons };
  }

  if (post.id && CURATED_REVIEWS_BY_ID[post.id]) {
    return CURATED_REVIEWS_BY_ID[post.id];
  }

  // Fallback por título/slug caso o ID seja de preview
  const titleLower = (post.title || "").toLowerCase();
  if (titleLower.includes("diablo")) return CURATED_REVIEWS_BY_ID.A4B7Oh8b0gTh0eIgjlQs;
  if (titleLower.includes("top gear")) return CURATED_REVIEWS_BY_ID.CKzjMHEgn1B4fEVoRAZG;
  if (titleLower.includes("turtles in time")) return CURATED_REVIEWS_BY_ID.GnPTir795GPX4w6L7Nxn;
  if (titleLower.includes("jackie chan")) return CURATED_REVIEWS_BY_ID.J4FIpZIwCIiTyOlSH1VI;
  if (titleLower.includes("naruto")) return CURATED_REVIEWS_BY_ID.WpntcErK86YMxWqJzJqn;
  if (titleLower.includes("lufia")) return CURATED_REVIEWS_BY_ID.nMRmCq0ss0baTa5PWLJC;
  if (titleLower.includes("chrono trigger")) return CURATED_REVIEWS_BY_ID.p76zyPiLGzBL0EvheqB4;
  if (titleLower.includes("radiata")) return CURATED_REVIEWS_BY_ID.x3BMiTBALFa1qNfbnrdl;

  return { pros: [], cons: [] };
}

/**
 * Analisa o texto do artigo, veredito e título para sugerir Prós e Contras
 * sucintos (usado pelo botão "✨ Gerar Prós & Contras da Análise" no Editor).
 * Se houver chave da API Gemini configurada, usa IA generativa; caso contrário,
 * utiliza extração heurística inteligente em português.
 */
export async function generateProsConsFromArticle(
  post: Partial<Post>
): Promise<ProsConsResult> {
  // 1. Se já existir no mapa curado das 8 matérias conhecidas e o usuário clicar para preencher
  const curated = resolvePostProsCons({ id: post.id, title: post.title });
  if (curated.pros.length > 0 || curated.cons.length > 0) {
    return curated;
  }

  const content = (post.content || "").trim();
  const verdict = (post.verdict || "").trim();
  const excerpt = (post.excerpt || "").trim();
  const { mainTitle } = splitTitle(post.title || "");
  const gameName = mainTitle || post.title || "o jogo";
  const score = Number(post.score) || 8.0;

  // 2. Tenta usar Gemini AI se o usuário tiver configurado a chave no ambiente
  const geminiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (geminiKey && (content.length > 50 || verdict.length > 20)) {
    try {
      const prompt = `Você é o editor-chefe do portal de games BeginsProject.
Analise a review abaixo do jogo "${gameName}" (Nota: ${score}/10) e extraia:
- 3 a 4 PRÓS bem sucintos e diretos (máximo de 8 a 11 palavras cada, sem ponto final).
- 1 a 2 CONTRAS bem sucintos e diretos (máximo de 8 a 11 palavras cada, sem ponto final).
Seja 100% fiel ao texto do autor. Responda APENAS em JSON válido no formato:
{"pros": ["item 1", "item 2", "item 3"], "cons": ["item 1", "item 2"]}

Resumo: ${excerpt}
Veredito: ${verdict}
Texto do Artigo:
${content.slice(0, 6000)}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (Array.isArray(parsed.pros) && Array.isArray(parsed.cons)) {
            return {
              pros: parsed.pros.slice(0, 4).map((s: string) => s.trim()),
              cons: parsed.cons.slice(0, 3).map((s: string) => s.trim()),
            };
          }
        }
      }
    } catch {
      // Prossegue para o extrator heurístico local caso a chamada falhe
    }
  }

  // 3. Extrator Heurístico Local Inteligente (Funciona 100% offline sem chave de API)
  const fullText = `${excerpt}\n${verdict}\n${content}`;
  const fullLower = fullText.toLowerCase();

  // Verifica se o próprio texto já contém blocos explícitos de PRÓS e CONTRAS
  const prosBlockMatch = content.match(
    /(?:pr[óo]s|pontos positivos)[:\s]*([\s\S]*?)(?:🔴|contras|pontos negativos|:::|$)/i
  );
  const consBlockMatch = content.match(
    /(?:contras|pontos negativos)[:\s]*([\s\S]*?)(?::::|##|$)/i
  );

  if (prosBlockMatch && consBlockMatch) {
    const extractedPros = prosBlockMatch[1]
      .split(/\n+/)
      .map((l) => l.replace(/^[-•*🟢✓+\s]+/, "").trim())
      .filter((l) => l.length > 8 && l.length < 110)
      .slice(0, 4);
    const extractedCons = consBlockMatch[1]
      .split(/\n+/)
      .map((l) => l.replace(/^[-•*🔴✕x-\s]+/, "").trim())
      .filter((l) => l.length > 8 && l.length < 110)
      .slice(0, 3);

    if (extractedPros.length > 0 && extractedCons.length > 0) {
      return { pros: extractedPros, cons: extractedCons };
    }
  }

  const pros: string[] = [];
  const cons: string[] = [];

  // Detecção temática baseada no conteúdo escrito pelo autor
  if (fullLower.includes("trilha sonora") || fullLower.includes("música") || fullLower.includes("compositor")) {
    pros.push("Trilha sonora marcante que eleva a atmosfera da aventura");
  }
  if (fullLower.includes("combate") || fullLower.includes("jogabilidade") || fullLower.includes("gameplay") || fullLower.includes("golpes")) {
    pros.push("Jogabilidade responsiva com mecânicas de combate envolventes");
  }
  if (fullLower.includes("arte") || fullLower.includes("visual") || fullLower.includes("gráficos") || fullLower.includes("animaç")) {
    pros.push("Direção de arte carismática e visual cheio de personalidade");
  }
  if (fullLower.includes("história") || fullLower.includes("narrativa") || fullLower.includes("personagens") || fullLower.includes("enredo")) {
    pros.push("Personagens carismáticos e narrativa que prende do início ao fim");
  }
  if (fullLower.includes("multiplayer") || fullLower.includes("sofá") || fullLower.includes("amigo") || fullLower.includes("replay") || fullLower.includes("desbloque")) {
    pros.push("Excelente fator replay e diversão garantida no multiplayer");
  }

  // Detecção de ressalvas / contras no texto
  if (fullLower.includes("câmera")) {
    cons.push("Câmera às vezes atrapalha em momentos que exigem precisão");
  }
  if (fullLower.includes("batalhas aleatórias") || fullLower.includes("repetitiv")) {
    cons.push("Ritmo pode cansar em trechos com combates muito frequentes");
  }
  if (fullLower.includes("curto") || fullLower.includes("curta") || fullLower.includes("rápido") || fullLower.includes("reduzido") || fullLower.includes("limitado")) {
    cons.push("Campanha principal ou elenco inicial poderiam ser maiores");
  }
  if (fullLower.includes("difícil") || fullLower.includes("dificuldade") || fullLower.includes("punitiv") || fullLower.includes("injust")) {
    cons.push("Picos de dificuldade podem frustrar jogadores menos pacientes");
  }

  // Garantias mínimas caso o texto ainda esteja curto
  if (pros.length < 3) {
    pros.push(`Forte identidade e ótimo aproveitamento da proposta de ${gameName}`);
  }
  if (pros.length < 3) {
    pros.push("Ritmo envolvente que recompensa a dedicação do jogador");
  }
  if (cons.length === 0) {
    cons.push(
      score >= 9.5
        ? "Praticamente sem falhas; deixa um padrão difícil de superar no gênero"
        : "Algumas mecânicas datadas mostram o peso do tempo em trechos pontuais"
    );
  }

  return {
    pros: pros.slice(0, 4),
    cons: cons.slice(0, 2),
  };
}

