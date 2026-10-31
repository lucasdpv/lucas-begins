export const SITE_CATEGORIES = ["Reviews", "Dossiê", "Animes & TV", "RetroCafé"];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/s$/, "");

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  review:
    "Análises com nota. A gente volta a jogar clássicos e lançamentos pra dizer se ainda valem o seu tempo.",
  dossie:
    "A história completa por trás de jogos, consoles e franquias que marcaram época: bastidores, curiosidades e legado.",
  "animes & tv":
    "Os animes, desenhos e tokusatsus que passavam na TV aberta e formaram uma geração, da Manchete à TV Globinho.",
  retrocafe:
    "Puxa uma cadeira: crônicas, opiniões e memórias da cultura gamer, das locadoras às discussões de hoje.",
};

const CATEGORY_TAGLINES: Record<string, string> = {
  todo: "Todas as matérias",
  review: "Análises com nota",
  dossie: "A história por trás dos jogos",
  "animes & tv": "Clássicos da TV aberta",
  retrocafe: "Crônicas e memórias",
};

export const getCategoryDescription = (category: string) => CATEGORY_DESCRIPTIONS[normalize(category)];
export const getCategoryTagline = (category: string) => CATEGORY_TAGLINES[normalize(category)];
