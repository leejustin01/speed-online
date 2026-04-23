import { initializeGame, reducer } from "@game/game-engine"
import { createCard } from "../packages/game-engine/src/deck"
import { cloneState, initializePlayer, applyCannotPlay, applyDrawCard, applyPlayCard, startGame } from "../packages/game-engine/src/gameEngine"
import { Move, PlayCardMove, DrawCardMove, CannotPlayMove } from "@game/types"

test("initializePlayer generates an empty player state with given id", () => {
    const id = "test123"
    const player = initializePlayer(id)

    expect(player.id).toBe(id)
    expect(player.hand).toHaveLength(0)
    expect(player.drawPile).toHaveLength(0)
    expect(player.canPlay).toBeTruthy()
})

test("initializeGame generates a freshly dealt game state", () => {
    const ids = ["test1", "test2"]

    const gameState = initializeGame(ids)

    expect(gameState.players).toHaveLength(2)
    expect(gameState.players[0].id).toBe("test1")
    expect(gameState.players[1].id).toBe("test2")
    expect(gameState.playPiles).toBeDefined()
    expect(gameState.playPiles[0]).toBeDefined()
    expect(gameState.drawPiles[0]).toHaveLength(6)
    expect(gameState.status).toBe("in_progress")
})

test("initializeGame fails when given an empty playerIds array", () => {
    const ids: string[] = []

    expect(() => { initializeGame(ids) }).toThrow()
})

test("initializeGame fails when given a 3-length playerIds array", () => {
    const ids = ["test1", "test2", "test3"]

    expect(() => { initializeGame(ids) }).toThrow()
})

test("startGame flips cards from draw pile", () => {
    const state = initializeGame(["p1", "p2"])
    const nextState = startGame(state)

    expect(nextState.drawPiles[0].length).toBe(5)
    expect(nextState.drawPiles[1].length).toBe(5)
    expect(nextState.playPiles[0].length).toBe(1)
    expect(nextState.playPiles[1].length).toBe(1)
})

test("startGame throws an error if draw piles are empty", () => {
    const state = initializeGame(["p1", "p2"])
    state.drawPiles = [[],[]]

    expect(() => { startGame(state) }).toThrow()
})

test("cloneState creates a deep copy", () => {
    const state = initializeGame(["p1", "p2"])
    const card = createCard(0, "clubs")

    state.players[0].hand.push(card)

    const cloned = cloneState(state)

    cloned.players[0].hand.push(createCard(0, "clubs"))

    expect(state.players[0].hand.length).toBe(6)
})

test("cloneState does not share references", () => {
    const state = initializeGame(["p1", "p2"])
    const cloned = cloneState(state)

    expect(cloned).not.toBe(state)
    expect(cloned.players).not.toBe(state.players)
    expect(cloned.players[0].hand).not.toBe(state.players[0].hand)
})

test("applyPlayCard moves card from hand to play pile", () => {
    const state = initializeGame(["p1", "p2"])
    const card = createCard(0, "clubs")
    const pileCard = createCard(1, "diamonds")

    state.players[0].hand.push(card)
    state.playPiles[0].push(pileCard)

    const move: PlayCardMove = {
        type: "PLAY_CARD",
        playerIndex: 0,
        cardId: "1c",
        pileIndex: 0
    }

    const result = applyPlayCard(state, move)

    expect(result.state.playPiles[0]).toContainEqual(card)
    expect(result.state.players[0].hand.length).toBe(5)
})

test("applyPlayCard does not mutate original state", () => {
    const state = initializeGame(["p1", "p2"])
    const card = createCard(0, "clubs")
    const pileCard = createCard(1, "diamonds")

    state.players[0].hand.push(card)
    state.playPiles[0].push(pileCard)

    const move: PlayCardMove = {
        type: "PLAY_CARD",
        playerIndex: 0,
        cardId: "1c",
        pileIndex: 0
    }

    applyPlayCard(state, move)

    expect(state.players[0].hand.length).toBe(6)
    expect(state.playPiles[0].length).toBe(1)
})

test("applyPlayCard returns an accurate finished game state when player 1 played their last card", () => {
    const state = initializeGame(["p1", "p2"])
    const card = createCard(0, "clubs")
    const pileCard = createCard(1, "diamonds")

    state.players[0].hand = []
    state.players[0].drawPile = []
    state.players[0].hand.push(card)
    state.playPiles[0].push(pileCard)

    const move: PlayCardMove = {
        type: "PLAY_CARD",
        playerIndex: 0,
        cardId: "1c",
        pileIndex: 0
    }

    const result = applyPlayCard(state, move)

    expect(result.message).toBe("GAME_OVER")
    expect(result.state.status).toBe("finished")
    expect(result.state.winner).toBe("p1")
})

test("applyPlayCard returns an accurate finished game state when player 2 played their last card", () => {
    const state = initializeGame(["p1", "p2"])
    const card = createCard(0, "clubs")
    const pileCard = createCard(1, "diamonds")

    state.players[1].hand = []
    state.players[1].drawPile = []
    state.players[1].hand.push(card)
    state.playPiles[0].push(pileCard)

    const move: PlayCardMove = {
        type: "PLAY_CARD",
        playerIndex: 1,
        cardId: "1c",
        pileIndex: 0
    }

    const result = applyPlayCard(state, move)

    expect(result.message).toBe("GAME_OVER")
    expect(result.state.status).toBe("finished")
    expect(result.state.winner).toBe("p2")
})

test("applyDrawCard moves card from drawPile to hand", () => {
    const state = initializeGame(["p1", "p2"])
    const card = createCard(0, "clubs")
    
    state.players[0].drawPile.push(card)
    state.players[0].hand = []

    const move: DrawCardMove = {
        type: "DRAW_CARD",
        playerIndex: 0
    }

    const result = applyDrawCard(state, move)

    expect(result.state.players[0].hand).toContainEqual(card)
    expect(result.state.players[0].drawPile.length).toBe(15)
})

test("applyDrawCard returns INVALID_MOVE when drawPile is empty", () => {
    const state = initializeGame(["p1", "p2"])

    state.players[0].drawPile = []

    const move: DrawCardMove = {
        type: "DRAW_CARD",
        playerIndex: 0
    }

    const result = applyDrawCard(state, move)

    expect(result.message).toBe("INVALID_MOVE")
})

test("applyCannotPlay sets player.canPlay to false if opponent can play", () => {
    const state = initializeGame(["p1", "p2"])

    const move: CannotPlayMove = {
        type: "CANNOT_PLAY",
        playerIndex: 0
    }

    const result = applyCannotPlay(state, move)

    expect(result.state.players[0].canPlay).toBe(false)
})

test("applyCannotPlay flips piles when both players cannot play", () => {
    const state = initializeGame(["p1", "p2"])

    state.players[1].canPlay = false

    state.drawPiles[0].push(createCard(0, "clubs"))
    state.drawPiles[1].push(createCard(1, "clubs"))

    const move: CannotPlayMove = {
        type: "CANNOT_PLAY",
        playerIndex: 0
    }

    const result = applyCannotPlay(state, move)

    expect(result.message).toBe("FLIP_CARDS")
    expect(result.state.playPiles[0].length).toBe(1)
    expect(result.state.playPiles[1].length).toBe(1)
})

test("applyCannotPlay returns INVALID_MOVE when trying to flip cards from empty center draw piles", () => {
    const state = initializeGame(["p1", "p2"])

    state.drawPiles = [[],[]]
    state.players[0].canPlay = false

    const move: CannotPlayMove = {
        type: "CANNOT_PLAY",
        playerIndex: 1
    }

    const result = applyCannotPlay(state, move)

    expect(result.message).toBe("INVALID_MOVE")
})

test("reducer calls applyPlayCard for PLAY_CARD", () => {
    const state = initializeGame(["p1", "p2"])
    const card = createCard(0, "clubs")
    const pileCard = createCard(1, "clubs")

    state.players[0].hand.push(card)
    state.playPiles[0].push(pileCard)

    const move: Move = {
        type: "PLAY_CARD",
        playerIndex: 0,
        cardId: "1c",
        pileIndex: 0
    }

    const result = reducer(state, move)

    expect(result.state.playPiles[0].length).toBe(2)
})

test("reducer calls applyDrawCard for DRAW_CARD", () => {
    const state = initializeGame(["p1", "p2"])

    state.players[0].hand = []

    const move: Move = {
        type: "DRAW_CARD",
        playerIndex: 0
    }

    const result = reducer(state, move)

    expect(result.state.players[0].hand.length).toBe(1)
})

test("reducer calls applyCannotPlay for CANNOT_PLAY", () => {
    const state = initializeGame(["p1", "p2"])

    const move: Move = {
        type: "CANNOT_PLAY",
        playerIndex: 0
    }

    const result = reducer(state, move)

    expect(result.state.players[0].canPlay).toBe(false)
})

test("reducer returns INVALID_MOVE when move is invalid", () => {
    const state = initializeGame(["p1", "p2"])

    const move: Move = {
        type: "PLAY_CARD",
        playerIndex: 0,
        cardId: "DOES_NOT_EXIST",
        pileIndex: 0
    }

    const result = reducer(state, move)

    expect(result.message).toBe("INVALID_MOVE")
})

