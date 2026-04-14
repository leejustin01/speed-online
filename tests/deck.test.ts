// tests/engine.test.ts
import { createDeck } from "@game/game-engine"

test("createDeck works", () => {
  expect(createDeck().length).toBe(52)
})