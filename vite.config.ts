import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Target modern browsers — enables smaller output via native ESM, async/await, etc.
    target: 'es2020',
    // Use more aggressive minification
    minify: 'esbuild',
    // Split CSS per chunk (better caching, smaller initial CSS)
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Manual chunk splitting — separates large vendor libs from app code
        // This gives Vercel/CDN better caching granularity
        manualChunks(id) {
          // Core React runtime — tiny, always needed
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // Motion/framer — large animation library, used everywhere but can be deferred
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // Lucide icons — tree-shakeable but many icons loaded together
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Radix UI — only load what's needed
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix';
          }
          // MUI — very large, chunk separately
          if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
            return 'vendor-mui';
          }
          // All other node_modules
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
})
