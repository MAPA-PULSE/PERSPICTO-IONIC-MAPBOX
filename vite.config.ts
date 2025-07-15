import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default ({ mode }) => {

  return defineConfig({
    
    optimizeDeps: { // 👈 optimizedeps
      esbuildOptions: {
        target: "esnext", 
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis'
        },
        supported: { 
          bigint: true 
        },
      }
    }, 

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    build: {
      target: ["esnext"], // 👈 build.target
    },
  })
}