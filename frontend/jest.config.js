export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/shared/api/client$': '<rootDir>/src/test/__mocks__/api/client.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@finans/components$': '<rootDir>/../components/src',
    '^@finans/components/(.*)$': '<rootDir>/../components/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test/__mocks__/styleMock.js'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/vite-env.d.ts',
    '!src/main.tsx',
    '!src/test/**'
  ],
  coverageThreshold: {
    'src/features/dashboard/useDashboardData.ts': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    'src/features/portfolio/usePortfolioData.ts': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    'src/features/sparing/useSparingData.ts': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    'src/features/gjeld/useGjeldData.ts': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    'src/features/pensjon/usePensjonData.ts': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  globals: {
    'import.meta': {
      env: {
        VITE_APP_ENV: 'test',
        VITE_API_URL: 'http://localhost:3000'
      }
    }
  }
};
