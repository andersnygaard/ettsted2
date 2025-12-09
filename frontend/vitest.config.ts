import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/features/dashboard/useDashboardData.ts',
        'src/features/portfolio/usePortfolioData.ts',
        'src/features/sparing/useSparingData.ts',
        'src/features/gjeld/useGjeldData.ts',
        'src/features/pensjon/usePensjonData.ts',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@finans/components': path.resolve(__dirname, '../components/src'),
    },
  },
});
