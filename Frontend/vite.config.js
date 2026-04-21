import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import lineClamp from '@tailwindcss/line-clamp'
// https://vite.dev/config/
export default defineConfig({
 plugins: [
    react(),
    tailwindcss({
      plugins: [lineClamp],
    }),
  ],
})
