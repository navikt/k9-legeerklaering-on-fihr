import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './'
})

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

export default createJestConfig(config);