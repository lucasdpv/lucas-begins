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
          light:   "#C8B8E0", // fundo da página — lavanda média (claramente visível)
          surface: "#DDD0F0", // superfície de cards / painéis (mais clara, elevada)
          input:   "#BBAACC", // inputs e áreas inset (inset mais escuro)
          mid:     "#AE9EC0", // divisórias, hover, cabeçalho de tabela
          dark:    "#2D1B69", // roxo profundo SNES (bordas, navbar, sombras)
          accent:  "#1A0B2E", // texto principal (dark navy-purple)
          muted:   "#5A4870", // texto secundário
          "purple-light": "#C084FC",
          "purple-deep":  "#7E22CE",
        }
      }
    },
  },
  plugins: [],
}