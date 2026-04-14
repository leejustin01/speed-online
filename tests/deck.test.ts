// tests/engine.test.ts
import { createDeck, shuffle, dealCards } from "@game/game-engine"
import { PlayerState } from "@game/types"

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
  
  const player1: PlayerState = { hand: [], drawPile: [], id: "1", canPlay: true }
  const player2: PlayerState = { hand: [], drawPile: [], id: "2", canPlay: true }
  const playersArray: PlayerState[] = [player1, player2]

  const { players, drawPiles } = dealCards(playersArray, deck)

  expect(players[0].hand).toHaveLength(5)
  expect(players[1].hand).toHaveLength(5)
  expect(players[0].drawPile).toHaveLength(15)
  expect(players[1].drawPile).toHaveLength(15)
  expect(drawPiles[0]).toHaveLength(6)
  expect(drawPiles[1]).toHaveLength(6)
})