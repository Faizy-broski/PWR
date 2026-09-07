import { defineConfig } from "vitest/config";
import path from "node:path";

// Separate from vitest.config.ts (unit tests) because these hit a real
// local Supabase instance — see tests/integration/README.md.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    include: ["tests/integration/**/*.test.ts"],
    testTimeout: 30_000,
  },
});
