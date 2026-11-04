export const SITE_CATEGORIES = ["Reviews", "Dossiê", "Animes & TV", "RetroCafé"];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/s$/, "");

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  review: "Vereditos e notas: o que realmente vale a pena jogar.",
  dossie: "Bastidores, segredos e o legado de grandes franquias.",
  "animes & tv": "Da Manchete à TV Globinho: a nostalgia da TV aberta.",
  retrocafe: "Crônicas, causos de locadora e memórias da era de ouro.",
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
