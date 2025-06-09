// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  vite: {
    define: {
      global: "globalThis",
    },
  },
});
