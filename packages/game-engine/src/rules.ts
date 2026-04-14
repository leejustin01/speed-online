import { Suit, Card, PlayerState, GameState, Move } from "@game/types"

export function isValidMove(
    gameState: GameState, 
    move: Move
): boolean {
    switch (move.type) {
        case "PLAY_CARD": {
            const player = gameState.players.find(ps => ps.id === move.playerId)
            if (!player) return false

            const card = player.hand.find(card => card.id === move.cardId)
            if (!card) return false

            if (move.pileIndex !== 0 && move.pileIndex !== 1) return false
            const pile = gameState.playPiles[move.pileIndex]

            const cardIsOneLess = ((card.rank + 1) % 13) === pile[pile.length - 1].rank
            const cardIsOneGreater = ((card.rank - 1) % 13) === pile[pile.length - 1].rank
            
            return cardIsOneGreater || cardIsOneLess
        }
        case "DRAW_CARD": {
            const player = gameState.players.find(ps => ps.id === move.playerId)
            if (!player) return false

            return player.hand.length < 5
        }
        case "CANNOT_PLAY": {
            return true
        }
        default: {
            return false
        }
    }
}

export function checkWin(
    gameState: GameState
): string | null {
    throw new Error("not implemented")
}

