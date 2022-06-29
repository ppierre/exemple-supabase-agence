import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import vueTypeImport from "vite-plugin-vue-type-imports";

// https://vitejs.dev/config/
export default defineConfig({
  build: { target: "es2020" },
  plugins: [vue(), Pages(), vueTypeImport()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
