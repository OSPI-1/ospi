import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ["**/.npm-cache/**", "**/dist/**", "**/*.tsbuildinfo"]
    }
  },
  test: {
    environment: "node",
    globals: true
  }
});
