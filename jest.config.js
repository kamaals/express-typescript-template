/** @type {import('ts-jest').JestConfigWithTsJest} **/

require("dotenv").config({
  path: ".env.test",
});

module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  transform: {
    "^.+.ts": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["@types", "dist"],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 55,
      lines: 70,
      statements: 0,
    },
  },
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "json", "html"],
};
