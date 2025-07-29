// import { defineConfig } from "vite";
// // import react, svelte and other needs...

// // https://vitejs.dev/config/
// export default ({ mode }) => {

//   return defineConfig({
    
//     optimizeDeps: { // 👈 optimizedeps
//       esbuildOptions: {
//         target: "esnext", 
//         // Node.js global to browser globalThis
//         define: {
//           global: 'globalThis'
//         },
//         supported: { 
//           bigint: true 
//         },
//       }
//     }, 

//     build: {
//       target: ["esnext"], // 👈 build.target
//     },
//   })
// }



import { defineConfig } from "vite";

export default ({ mode }) => {
  return defineConfig({
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
        define: {
          global: "globalThis",
        },
        supported: {
          bigint: true,
        },
      },
    },

    build: {
      target: ["esnext"],
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Divide los node_modules en chunks separados
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000, // Opcional: subir el límite si tus bundles son grandes
    },
  });
};
