import { initializeGame, startGame } from "@game/game-engine"
import { reducer } from "@game/game-engine"
import { getValidMoves, getRandomValidMove } from "@game/simulation"

test("getValidMoves only returns valid moves", () => {
    let state = initializeGame(["p1", "p2"])
    state = startGame(state)

    const moves = getValidMoves(state, 0)

    for (const move of moves) {
        const result = reducer(state, move)
        expect(result.message).not.toBe("INVALID_MOVE")
    }
})

test("getValidMoves returns a valid move set or empty", () => {
    let state = initializeGame(["p1", "p2"])
    state = startGame(state)

    const moves = getValidMoves(state, 0)

    expect(Array.isArray(moves)).toBe(true)
})

test("CANNOT_PLAY only appears when no play moves exist", () => {
    let state = initializeGame(["p1", "p2"])
    state = startGame(state)

    const moves = getValidMoves(state, 0)

    const hasPlayMoves = moves.some(m => m.type === "PLAY_CARD")
    const hasCannotPlay = moves.some(m => m.type === "CANNOT_PLAY")

    if (hasCannotPlay) {
        expect(hasPlayMoves).toBe(false)
    }
})

test("getRandomValidMove returns only valid moves", () => {
    let state = initializeGame(["p1", "p2"])
    state = startGame(state)

    for (let i = 0; i < 50; i++) {
        const move = getRandomValidMove(state, 0)
        if (!move) continue

        const result = reducer(state, move)
        expect(result.message).not.toBe("INVALID_MOVE")
    }
})