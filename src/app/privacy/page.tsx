import PrivacyPolicyPage from "../../views/PrivacyPolicyPage";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
  SITE_NAME,
} from "../../lib/siteMetadata";

export const metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade do portal BeginsProject. Entenda como coletamos, usamos e protegemos os seus dados.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: `Política de Privacidade | ${SITE_NAME}`,
    description: "Política de Privacidade do portal BeginsProject. Entenda como coletamos, usamos e protegemos os seus dados.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: DEFAULT_TWITTER_CARD,
    title: `Política de Privacidade | ${SITE_NAME}`,
    description: "Política de Privacidade do portal BeginsProject. Entenda como coletamos, usamos e protegemos os seus dados.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
