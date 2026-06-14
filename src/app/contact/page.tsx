import ContactPage from "../../views/ContactPage";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
  SITE_NAME,
} from "../../lib/siteMetadata";

export const metadata = {
  title: "Quest Log: Contato",
  description: "Fale com o Player 1 do BeginsProject. Envie sugestões, reporte bugs ou troque uma ideia sobre a cultura gamer.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Quest Log: Contato | ${SITE_NAME}`,
    description: "Fale com o Player 1 do BeginsProject. Envie sugestões, reporte bugs ou troque uma ideia sobre a cultura gamer.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: DEFAULT_TWITTER_CARD,
    title: `Quest Log: Contato | ${SITE_NAME}`,
    description: "Fale com o Player 1 do BeginsProject. Envie sugestões, reporte bugs ou troque uma ideia sobre a cultura gamer.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Page() {
  return <ContactPage />;
}
