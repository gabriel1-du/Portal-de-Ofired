/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Para usar 'it', 'expect', 'describe' sin importar
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'], // Opcional, para configuraciones extra
  },
})