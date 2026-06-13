import ArchivePage from "../../views/ArchivePage";

export const metadata = {
  title: "Dossiê de Fases e Artigos | BeginsProject",
  description: "Explore o arquivo completo de posts do BeginsProject. Filtre por categorias como Reviews, Dossiês, RetroCafé e muito mais.",
  alternates: {
    canonical: "https://lucasbegins.com.br/archive",
  },
};

export default function Page() {
  return <ArchivePage />;
}
