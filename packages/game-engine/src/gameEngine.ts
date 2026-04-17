import { Card, PlayerState, GameState, Move } from "@game/types"
import { createDeck, shuffle, dealCards } from "./deck"

export function initializeGame(
    playerIds: string[]
): GameState {
    if (playerIds.length !== 2) throw new Error("invalid playerIds array.")
        
    const player1 = initializePlayer(playerIds[0])
    const player2 = initializePlayer(playerIds[1])

    const deck = shuffle(createDeck())

    const { players, drawPiles } = dealCards([player1, player2], deck)

    const gameState: GameState = {
        players: players,
        playPiles: [[], []],
        drawPiles: drawPiles,
        status: "in_progress"
    }

    return gameState
}

export function initializePlayer(
    playerId: string
): PlayerState {
    const player: PlayerState = {
        hand: [],
        drawPile: [],
        id: playerId,
        canPlay: true,
        moveCount: 0
    }

    return player
}

export function applyMove(
    gameState: GameState, 
    move: Move
): GameState {
    throw new Error("not implemented")
}



