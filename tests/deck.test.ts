// tests/engine.test.ts
import { createCard, createDeck, shuffle, dealCards } from "../packages/game-engine/src/deck"
import { initializePlayer } from "../packages/game-engine/src/gameEngine"
import { PlayerState } from "@game/types"

test("createCard generates a card with correctly populated properties", () => {
  const aceOfClubs = createCard(0, "clubs")

  expect(aceOfClubs.suit).toBe("clubs")
  expect(aceOfClubs.id).toBe("1c")
  expect(aceOfClubs.rank).toBe(0)
})

test("createCard fails when given an invalid rank", () => {
  expect(() => { createCard(-1, "clubs") }).toThrow()
  expect(() => { createCard(13, "clubs") }).toThrow()
})

test("createDeck generates a conventional 52 card deck", () => {
  const deck = createDeck()
  expect(deck).toHaveLength(52)
  expect(deck[0].id === "1d")
  expect(deck[51].id === "13c")
})

test("shuffle preserves all elements", () => {
  const deck = createDeck()
  const output = shuffle(deck)

  expect(output).toHaveLength(deck.length)
  expect(output.sort((a, b) => a.rank - b.rank)).toBe(deck.sort((a, b) => a.rank - b.rank))
})

test("dealCards deals the correct amount of cards to each element", () => {
  const deck = shuffle(createDeck())
  
  const player1 = initializePlayer("1")
  const player2 = initializePlayer("2")
  const playersArray: PlayerState[] = [player1, player2]

  const { players, drawPiles } = dealCards(playersArray, deck)

  expect(players[0].hand).toHaveLength(5)
  expect(players[1].hand).toHaveLength(5)
  expect(players[0].drawPile).toHaveLength(15)
  expect(players[1].drawPile).toHaveLength(15)
  expect(drawPiles[0]).toHaveLength(6)
  expect(drawPiles[1]).toHaveLength(6)
})