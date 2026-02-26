import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./__tests__/vitest-setup.ts"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text"],
      exclude: [
        "next.config.ts",
        "postcss.config.mjs",
        "scripts/**",
        "**/*.config.{js,ts,mjs,mts}",
        "**/*.d.ts",
        "node_modules/**",
        ".next/**",
        "public/**",
        "__tests__/**",
        "coverage/**",
        ".vscode/**",
        ".git/**",
        "*.md",
        "*.json",
        "cypress/**",
        // Barrel re-export files — no executable logic to cover
        "src/components/index.ts",
        "src/components/ui/index.ts",
        "src/app/docs",
      ],
    },
  },
});
