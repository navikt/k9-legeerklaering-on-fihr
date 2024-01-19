import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './'
})

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: '@happy-dom/jest-environment',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

export default createJestConfig(config);