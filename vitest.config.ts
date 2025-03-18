import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: './src/test/setup.ts',
    globals: true, 
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json'],
      include: ['src/**/*.{tsx, ts}'],
    },
  },
});
