import PrivacyPolicyPage from "../../views/PrivacyPolicyPage";

export const metadata = {
  title: "Política de Privacidade | BeginsProject",
  description: "Política de Privacidade do portal BeginsProject. Entenda como coletamos, usamos e protegemos os seus dados.",
  alternates: {
    canonical: "https://lucasbegins.com.br/privacy",
  },
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
