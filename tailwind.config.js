/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        snes: {
          light: "#F8F9FB", // Gelo perolado limpo
          mid: "#F1F5F9",   // Cinza azulado suave
          dark: "#000000",  // Preto para bordas e sombras (Troca do 8C8C8C)
          accent: "#000000", // Texto e detalhes
          "purple-light": "#C084FC", // Roxo vibrante suave
          "purple-deep": "#7E22CE",   // Roxo elétrico
        }
      }
    },
  },
  plugins: [],
}