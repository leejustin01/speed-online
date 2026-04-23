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
            if (move.playerIndex !== 0 && move.playerIndex !== 1) return false
            if (move.pileIndex !== 0 && move.pileIndex !== 1) return false

            const player = gameState.players[move.playerIndex]
            
            if (!player.canPlay) return false

            const card = player.hand.find(card => card.id === move.cardId)
            if (!card) return false
            
            const pile = gameState.playPiles[move.pileIndex]

            const cardIsOneLess = (mod((card.rank + 1), 13)) === pile[pile.length - 1].rank
            const cardIsOneGreater = (mod((card.rank - 1), 13)) === pile[pile.length - 1].rank
        
            return cardIsOneGreater || cardIsOneLess
        }
        case "DRAW_CARD": {
            if (move.playerIndex !== 0 && move.playerIndex !== 1) return false
            const player = gameState.players[move.playerIndex]

            return player.hand.length < 5 && player.drawPile.length > 0
        }
        case "CANNOT_PLAY": {
            const player = gameState.players[move.playerIndex]
            if (!player.canPlay) return false
            return gameState.drawPiles[0].length > 0 && gameState.drawPiles[1].length > 0
        }
    }
}

export function checkWin(
    gameState: GameState
): string {
    const p1Finished = gameState.players[0].hand.length <= 0 && gameState.players[0].drawPile.length <= 0
    const p2Finished = gameState.players[1].hand.length <= 0 && gameState.players[1].drawPile.length <= 0

    if (p1Finished && p2Finished) throw new Error("Both players have no cards left.")

    if (p1Finished) return gameState.players[0].id
    if (p2Finished) return gameState.players[1].id

    return ""
}
