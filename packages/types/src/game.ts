export type Suit = "hearts" | "diamonds" | "spades" | "clubs"

export type Card = {
  suit: Suit
  rank: number
  id: string
}

export type PlayerState = {
  hand: Card[]
  drawPile: Card[]
  id: string
  canPlay: boolean
}

export type GameState = {
  players: PlayerState[]
  playPiles: Card[][]
  drawPiles: Card[][]
  status: "waiting" | "in_progress" | "finished"
  winner?: string
}

export type Move =
  | { type: "PLAY_CARD"; playerIndex: number; cardId: string; pileIndex: number }
  | { type: "DRAW_CARD"; playerIndex: number }
  | { type: "CANNOT_PLAY"; playerIndex: number }

export type PlayCardMove = Extract<Move, { type: "PLAY_CARD" }>
export type DrawCardMove = Extract<Move, { type: "DRAW_CARD" }>
export type CannotPlayMove = Extract<Move, { type: "CANNOT_PLAY" }>

export type Message = "INVALID_MOVE" | "FLIP_CARDS" |"SUCCESSFUL_MOVE" | "GAME_OVER"