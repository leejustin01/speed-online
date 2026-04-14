import { initializeGame, initializePlayer } from "@game/game-engine"

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

test("initializeGame fails when given an invalid playerIds array", () => {
    const ids1: string[] = []
    const ids2 = ["test1", "test2", "test3"]

    expect(() => { initializeGame(ids1) }).toThrow()
    expect(() => { initializeGame(ids2) }).toThrow()
})