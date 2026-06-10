import HomePage from "../views/HomePage";

export const metadata = {
  title: "BeginsProject | Portal de Games, Reviews e Cultura Pop",
  description: "Reviews, nostalgia e cultura gamer. Onde a era de ouro dos videogames vive.",
  alternates: {
    canonical: "https://lucasbegins.com.br",
  },
};

export default function Page() {
  return <HomePage />;
}
