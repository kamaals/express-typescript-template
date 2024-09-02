/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  transform: {
    '^.+.ts': ['ts-jest', {}]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json', 'html']
};
