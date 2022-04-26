import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 100000,
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};

export default config;
