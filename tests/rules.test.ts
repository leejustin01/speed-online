import { isValidMove, checkWin } from "../packages/game-engine/src/rules"
import { initializeGame, initializePlayer } from "@game/game-engine"
import { Card, PlayerState, GameState, Move } from "@game/types"
import { createCard } from "../packages/game-engine/src/deck"


test("isValidMove returns true for playing an ace on a two", () => {
    const game = initializeGame(["p1", "p2"])

    const ace = createCard(0, "diamonds")
    const two = createCard(1, "diamonds")

    game.players[0].hand.push(ace)
    game.playPiles[0].push(two)

    const playAceOnTwo: Move = {
        type: "PLAY_CARD",
        playerId: "p1",
        cardId: "1d",
        pileIndex: 0
    }

    expect(isValidMove(game, playAceOnTwo)).toBe(true)
})

test("isValidMove returns true for playing an ace on a king", () => {
    const game = initializeGame(["p1", "p2"])

    const ace = createCard(0, "diamonds")
    const king = createCard(12, "clubs")

    game.players[0].hand.push(ace)
    game.playPiles[1].push(king)

    const playAceOnKing: Move = {
        type: "PLAY_CARD",
        playerId: "p1",
        cardId: "1d",
        pileIndex: 1
    }

    expect(isValidMove(game, playAceOnKing)).toBe(true)
})

test("isValidMove returns false for playing an ace on a 3", () => {
    const game = initializeGame(["p1", "p2"])

    const ace = createCard(0, "diamonds")
    const three = createCard(2, "clubs")

    game.players[0].hand.push(ace)
    game.playPiles[1].push(three)

    const playAceOnThree: Move = {
        type: "PLAY_CARD",
        playerId: "p1",
        cardId: "1d",
        pileIndex: 1
    }

    expect(isValidMove(game, playAceOnThree)).toBe(false)
})

test("isValidMove returns false for playing an ace on a queen", () => {
    const game = initializeGame(["p1", "p2"])

    const ace = createCard(0, "diamonds")
    const queen = createCard(11, "clubs")

    game.players[1].hand.push(ace)
    game.playPiles[1].push(queen)

    const playAceOnQueen: Move = {
        type: "PLAY_CARD",
        playerId: "p2",
        cardId: "1d",
        pileIndex: 1
    }

    expect(isValidMove(game, playAceOnQueen)).toBe(false)
})

test("isValidMove returns true for drawing when a player's hand size is < 5", () => {
    const game = initializeGame(["p1", "p2"])

    const ace = createCard(0, "diamonds")

    const draw: Move = {
        type: "DRAW_CARD",
        playerId: "p1"
    }

    game.players[0].hand = []
    for (let i = 0; i < 4; i++) {
        game.players[0].hand.push(ace)
        expect(isValidMove(game, draw)).toBe(true)
    }
})

test("isValidMove returns false for drawing when a player's hand size is >= 5", () => {
    const game = initializeGame(["p1", "p2"])

    const ace = createCard(0, "diamonds")

    const draw: Move = {
        type: "DRAW_CARD",
        playerId: "p1"
    }

    expect(isValidMove(game, draw)).toBe(false)

    game.players[0].hand.push(ace)
    expect(isValidMove(game, draw)).toBe(false)
})

test("isValidMove returns true for the 'cannot play' action", () => {
    const game = initializeGame(["p1", "p2"])

    const cannotPlay: Move = {
        type: "CANNOT_PLAY",
        playerId: "p1"
    }

    expect(isValidMove(game, cannotPlay)).toBe(true)
})

test("checkWin returns player1's id when player1 is out of cards", () => {
    const game = initializeGame(["p1", "p2"])

    game.players[0].hand = []
    game.players[0].drawPile = []

    expect(checkWin(game)).toBe("p1")
})

test("checkWin returns null when both players have cards", () => {
    const game = initializeGame(["p1", "p2"])

    expect(checkWin(game)).toBeNull()
})