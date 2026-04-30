import { PlayerState, GameState, Move, Message, PlayCardMove, DrawCardMove, CannotPlayMove } from "@game/types"
import { createDeck, shuffle, dealCards } from "./deck"
import { checkWin, isValidMove } from "./rules"

/* Returns a game state that is ready for play
   Deck has been shuffled and dealt out:
        - Players have 5 cards in hand
        - Players have 15 cards in their draw piles
        - Center draw piles have 6 cards
*/
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

export function setPlayerId(
    state: GameState,
    idx: number,
    id: string
): boolean {
    if (idx !== 0 && idx !== 1) return false

    const newState = cloneState(state)

    const player = newState.players[idx]
    if (!player) return false

    player.id = id

    return true
}

export function startGame(
    state: GameState
): GameState {
    const newState = cloneState(state)
    
    const card0 = newState.drawPiles[0].pop()
    const card1 = newState.drawPiles[1].pop()

    if (!card0 || !card1) {
        throw new Error("Game state initialized with empty draw piles.")
    }

    newState.playPiles[0].push(card0)
    newState.playPiles[1].push(card1)

    return newState
}

export function initializePlayer(
    playerId: string
): PlayerState {
    const player: PlayerState = {
        hand: [],
        drawPile: [],
        id: playerId,
        canPlay: true
    }

    return player
}

export function reducer(
    state: GameState,
    move: Move
): { state: GameState, message: Message } {
    if (!isValidMove(state, move)) return { state: state, message: "INVALID_MOVE" }

    switch (move.type) {
        case "PLAY_CARD": 
            return applyPlayCard(state, move)
        case "DRAW_CARD":
            return applyDrawCard(state, move)
        case "CANNOT_PLAY":
            return applyCannotPlay(state, move)
    }
}

export function cloneState(state: GameState): GameState {
  return {
    status: state.status,
    winner: state.winner,

    players: state.players.map(player => ({
      id: player.id,
      canPlay: player.canPlay,
      hand: player.hand.map(card => ({ ...card })),
      drawPile: player.drawPile.map(card => ({ ...card }))
    })),

    playPiles: state.playPiles.map(pile =>
      pile.map(card => ({ ...card }))
    ),

    drawPiles: state.drawPiles.map(pile =>
      pile.map(card => ({ ...card }))
    )
  }
}

export function applyPlayCard(
    state: GameState,
    move: PlayCardMove
): { state: GameState, message: Message } {
    const newState = cloneState(state)

    const player = newState.players[move.playerIndex]
    const playPile = newState.playPiles[move.pileIndex]

    const cardIndex = player.hand.findIndex(c => c.id === move.cardId)
    const card = player.hand[cardIndex]

    playPile.push(card)
    player.hand.splice(cardIndex, 1)

    const winner = checkWin(newState)
    if (winner !== "") {
        newState.status = "finished"
        newState.winner = winner
        return { state: newState, message: "GAME_OVER" }
    }

    return { state: newState, message: "SUCCESSFUL_MOVE" }
}

export function applyDrawCard(
    state: GameState,
    move: DrawCardMove
): { state: GameState, message: Message } {
    const newState = cloneState(state)

    const player = newState.players[move.playerIndex]
    const card = player.drawPile.pop()
    if (!card) return { state: newState, message: "INVALID_MOVE" }
    player.hand.push(card)
    return { state: newState, message: "SUCCESSFUL_MOVE" }
}

export function applyCannotPlay(
    state: GameState,
    move: CannotPlayMove
): { state: GameState, message: Message } {
    const newState = cloneState(state)

    const player = newState.players[move.playerIndex]
    const opponentIndex = move.playerIndex === 0 ? 1 : 0
    const opponent = newState.players[opponentIndex]

    if (!opponent.canPlay) {
        const card0 = newState.drawPiles[0].pop()
        const card1 = newState.drawPiles[1].pop()

        if (!card0 || !card1) {
            return { state: newState, message: "INVALID_MOVE" }
        }

        newState.playPiles[0].push(card0)
        newState.playPiles[1].push(card1)
        
        opponent.canPlay = true
        return { state: newState, message: "FLIP_CARDS" }
    }

    player.canPlay = false
    return { state: newState, message: "SUCCESSFUL_MOVE" }
}