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
          light: "#F8F9FB", // Gelo perolado (Cards)
          mid: "#D4D2DB",   // Cinza suave da paleta (Fundo)
          dark: "#000000",  // Preto (Bordas)
          accent: "#000000", // Texto
          "purple-light": "#C084FC", // Roxo original
          "purple-deep": "#7E22CE",   // Roxo original
        }
      }
    },
  },
  plugins: [],
}