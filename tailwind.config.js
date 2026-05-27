/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        snes: {
          light:   "#f7f5fa", // Off-white Lavanda (Fundo SNES)
          surface: "#ffffff", // Pure White (Cards)
          input:   "#e8e6f4", // Soft Lavender (Acento Suave)
          mid:     "#e2e0e9", // Soft Lavender Gray (Divisórias)
          dark:    "#5f52cf", // SNES Purple (Vibrant Purple para Botões)
          accent:  "#1c1524", // Dark Purple Charcoal (Texto e Sombras)
          muted:   "#5a4870", 
          "purple-light": "#e8e6f4",
          "purple-deep":  "#5f52cf",
        }
      }
    },
  },
  plugins: [],
}