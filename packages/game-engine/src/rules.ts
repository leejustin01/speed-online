import { Card, PlayerState, GameState, Move } from "@game/types"

// js '%' is the remainder operator, not modulo
// this modulo formula is taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#:~:text=Note%20that%20while%20in%20most,js%20Copy
function mod(
    n: number,
    d: number
): number {
    return ((n % d) + d) % d
}

export function isValidMove(
    gameState: GameState, 
    move: Move
): boolean {
    switch (move.type) {
        case "PLAY_CARD": {
            const player = gameState.players.find(ps => ps.id === move.playerId)
            if (!player) return false
            
            if (!player.canPlay) return false

            const card = player.hand.find(card => card.id === move.cardId)
            if (!card) return false

            if (move.pileIndex !== 0 && move.pileIndex !== 1) return false
            const pile = gameState.playPiles[move.pileIndex]

            const cardIsOneLess = (mod((card.rank + 1), 13)) === pile[pile.length - 1].rank
            const cardIsOneGreater = (mod((card.rank - 1), 13)) === pile[pile.length - 1].rank
        
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
    }
}

export function checkWin(
    gameState: GameState
): string | null {
    const p1Finished = gameState.players[0].hand.length <= 0 && gameState.players[0].drawPile.length <= 0
    const p2Finished = gameState.players[1].hand.length <= 0 && gameState.players[0].drawPile.length <= 0

    if (p1Finished && p2Finished) throw new Error("Both players have no cards left.")

    if (p1Finished) return gameState.players[0].id
    if (p2Finished) return gameState.players[1].id

    return null
}

