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
          light:   "#cec9cc", // Light Gray (Fundo SNES)
          surface: "#e2e2e2", // Surface Gray (Cards)
          input:   "#b5b6e4", // Lavender (Acento Suave)
          mid:     "#908a99", // Medium Gray (Divisórias)
          dark:    "#4f43ae", // SNES Purple (Botões e Destaques)
          accent:  "#211a21", // Dark Gray (Texto e Sombras)
          muted:   "#5a4870", 
          "purple-light": "#b5b6e4",
          "purple-deep":  "#4f43ae",
        }
      }
    },
  },
  plugins: [],
}