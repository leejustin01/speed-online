import { reducer } from "@game/game-engine";
import { GameState, Move } from "@game/types";

export function getValidMoves(state: GameState, playerIndex: number): Move[] {
    const moves: Move[] = []
    const player = state.players[playerIndex]

    for (const card of player.hand) {
        for (let pileIndex = 0; pileIndex < state.playPiles.length; pileIndex++) {
        const move: Move = {
            type: "PLAY_CARD",
            playerIndex: playerIndex,
            cardId: card.id,
            pileIndex: pileIndex
        }

        const result = reducer(state, move)
        if (result.message !== "INVALID_MOVE") {
            moves.push(move)
        }
        }
    }

    const drawMove: Move = {
        type: "DRAW_CARD",
        playerIndex
    }

    let result = reducer(state, drawMove)
    
    if (result.message !== "INVALID_MOVE") {
        moves.push(drawMove)
    }

    if (moves.length === 0) {
        const cannotPlayMove: Move = {
            type: "CANNOT_PLAY",
            playerIndex
        }

        result = reducer(state, cannotPlayMove)
        
        if (result.message !== "INVALID_MOVE") {
            moves.push(cannotPlayMove)
        }
    }

    return moves
}

export function getRandomValidMove(
    state: GameState, 
    playerIndex: number
): Move | null {
  const validMoves = getValidMoves(state, playerIndex)

  if (validMoves.length === 0) return null

  const index = Math.floor(Math.random() * validMoves.length)
  return validMoves[index]
}