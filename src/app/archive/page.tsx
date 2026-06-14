import ArchivePage from "../../views/ArchivePage";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
  SITE_NAME,
} from "../../lib/siteMetadata";

export const metadata = {
  title: "Dossiê de Fases e Artigos",
  description: "Explore o arquivo completo de posts do BeginsProject. Filtre por categorias como Reviews, Dossiês, RetroCafé e muito mais.",
  alternates: {
    canonical: "/archive",
  },
  openGraph: {
    title: `Dossiê de Fases e Artigos | ${SITE_NAME}`,
    description: "Explore o arquivo completo de posts do BeginsProject. Filtre por categorias como Reviews, Dossiês, RetroCafé e muito mais.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: DEFAULT_TWITTER_CARD,
    title: `Dossiê de Fases e Artigos | ${SITE_NAME}`,
    description: "Explore o arquivo completo de posts do BeginsProject. Filtre por categorias como Reviews, Dossiês, RetroCafé e muito mais.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Page() {
  return <ArchivePage />;
}
