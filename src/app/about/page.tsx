import AboutPage from "../../views/AboutPage";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
  SITE_NAME,
} from "../../lib/siteMetadata";

const aboutDescription =
  "Conheça a história e os bastidores do BeginsProject (Lucas Begins), um portal dedicado à nostalgia gamer, reviews de jogos retro e à preservação da história dos videogames.";

export const metadata = {
  title: "A História",
  description: aboutDescription,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `A História | ${SITE_NAME}`,
    description: aboutDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: DEFAULT_TWITTER_CARD,
    title: `A História | ${SITE_NAME}`,
    description: aboutDescription,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Page() {
  return <AboutPage />;
}
