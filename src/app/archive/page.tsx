import ArchivePage from "../../views/ArchivePage";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
  SITE_NAME,
} from "../../lib/siteMetadata";

export const metadata = {
  title: "Catálogo Completo",
  description: "Explore o arquivo completo de posts do BeginsProject. Filtre por Reviews, Dossiês, Animes & TV e RetroCafé.",
  alternates: {
    canonical: "/archive",
  },
  openGraph: {
    title: `Catálogo Completo | ${SITE_NAME}`,
    description: "Explore o arquivo completo de posts do BeginsProject. Filtre por Reviews, Dossiês, Animes & TV e RetroCafé.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: DEFAULT_TWITTER_CARD,
    title: `Catálogo Completo | ${SITE_NAME}`,
    description: "Explore o arquivo completo de posts do BeginsProject. Filtre por Reviews, Dossiês, Animes & TV e RetroCafé.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Page() {
  return <ArchivePage />;
}
