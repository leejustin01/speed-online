import { Suit, Card, PlayerState, Pile, GameState, Move } from "@game/types"

export function isValidMove(
    gameState: GameState, 
    move: Move
): boolean {
    throw new Error("not implemented")
}

export function checkWin(
    gameState: GameState
): string | null {
    throw new Error("not implemented")
}

