import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base relativa para funcionar no GitHub Pages em /Impostor/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
