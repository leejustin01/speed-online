import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@game/types$": "<rootDir>/packages/shared-types/src/index.ts",
    "^@game/types/(.*)$": "<rootDir>/packages/types/src/$1",
    "^@game/game-engine/(.*)$": "<rootDir>/packages/game-engine/src/$1"
  }
}

export default config