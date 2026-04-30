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
          light:   "#EDE5F7", // fundo da página — lavanda quente (corpo do SNES)
          surface: "#F5F0FC", // superfície de cards / painéis
          input:   "#E4DCF2", // inputs e áreas inset
          mid:     "#D5CCEB", // divisórias, hover, cabeçalho de tabela
          dark:    "#2D1B69", // roxo profundo SNES (bordas, navbar, sombras)
          accent:  "#1A0B2E", // texto principal (dark navy-purple)
          muted:   "#6B5B8A", // texto secundário
          "purple-light": "#C084FC",
          "purple-deep":  "#7E22CE",
        }
      }
    },
  },
  plugins: [],
}