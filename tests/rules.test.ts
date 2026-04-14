import { isValidMove, checkWin } from "@game/game-engine"
import { initializeGame } from "@game/game-engine"

test("isValidMove correctly validates move requests", () => {
    const gameState = initializeGame(["test1", "test2"])

    // need very specific game state to test this
})