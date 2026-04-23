import { reducer, initializeGame, startGame } from "@game/game-engine"
import { getRandomValidMove } from "@game/simulation"

test("simulation runs without invalid states or crashes", () => {
    const state = initializeGame(["p1", "p2"])

    let currentState = startGame(state)
    let currentPlayer = 0

    for (let i = 0; i < 500; i++) {
        const move = getRandomValidMove(currentState, currentPlayer)

        if (!move) break

        const result = reducer(currentState, move)

        expect(result.message).not.toBe("INVALID_MOVE")

        currentState = result.state

        if (currentState.status === "finished") break

        currentPlayer = (currentPlayer + 1) % currentState.players.length
    }

    expect(currentState).toBeDefined()
})

test("no duplicate cards exist in game state", () => {
    const state = initializeGame(["p1", "p2"])

    const allCards = [
        ...state.players.flatMap(p => p.hand),
        ...state.players.flatMap(p => p.drawPile),
        ...state.playPiles.flat(),
        ...state.drawPiles.flat()
    ]

    const ids = allCards.map(c => c.id)

    expect(new Set(ids).size).toBe(ids.length)
})

test("game state contains no undefined cards", () => {
    const state = initializeGame(["p1", "p2"])

    const allCards = [
        ...state.players.flatMap(p => p.hand),
        ...state.playPiles.flat(),
        ...state.drawPiles.flat()
    ]

    for (const card of allCards) {
        expect(card).toBeDefined()
        expect(card.id).toBeDefined()
    }
})

test("engine is stable under long random simulation", () => {
    for (let game = 0; game < 50; game++) {
        let state = initializeGame(["p1", "p2"])
        state = startGame(state)
        let currentPlayer = 0

        for (let i = 0; i < 1000; i++) {
            const move = getRandomValidMove(state, currentPlayer)
            if (!move) break

            const result = reducer(state, move)

            expect(result.message).not.toBe("INVALID_MOVE")

            state = result.state
            if (state.status === "finished") break

            currentPlayer = (currentPlayer + 1) % 2
        }

        // final invariants
        const allCards = [
            ...state.players.flatMap(p => p.hand),
            ...state.playPiles.flat(),
            ...state.drawPiles.flat()
        ]

        const ids = allCards.map(c => c.id)
        expect(new Set(ids).size).toBe(ids.length)
    }
})