
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/__tests__/**/*.test.ts" 
  ],
  setupFilesAfterEnv: [], 
  verbose: true, 
  forceExit: true, 
  detectOpenHandles: true, 
  moduleNameMapper: {
  
  },
  collectCoverage: false, 
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/",
    "/dist/"
  ],
};

export default config;
