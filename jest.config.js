/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest to handle TypeScript
  preset: "ts-jest",

  // Run tests in Node environment (not jsdom)
  testEnvironment: "node",

  // Where Jest should look for tests
  roots: ["<rootDir>/apps", "<rootDir>/packages", "<rootDir>/tests"],

  // Test file patterns
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(test).[jt]s?(x)"
  ],

  // Module path aliases (IMPORTANT for your shared types)
  moduleNameMapper: {
    "^@game/types$": "<rootDir>/packages/shared-types/src/index.ts",
    "^@game/types/(.*)$": "<rootDir>/packages/shared-types/src/$1",

    "^@game/game-engine$": "<rootDir>/packages/game-engine/src/index.ts",
    "^@game/game-engine/(.*)$": "<rootDir>/packages/game-engine/src/$1",

    "^@game/simulation$": "<rootDir>/packages/simulation/src/index.ts",
    "^@game/simulation/(.*)$": "<rootDir>/packages/simulation/src/$1",

    "^@game/protocol$": "<rootDir>/packages/protocol/src/index.ts",
    "^@game/protocol/(.*)$": "<rootDir>/packages/protocol/src/$1"
  },

  // Transform TypeScript files
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  // Ignore build output and node_modules
  transformIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],

  // Clear mocks between tests (good default for games)
  clearMocks: true,

  // Collect coverage (useful for engine logic)
  collectCoverage: true,

  coverageDirectory: "coverage",

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ]
};