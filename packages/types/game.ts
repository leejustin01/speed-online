type Suit = "hearts" | "diamonds" | "spades" | "clubs"

export type Card = {
  suit: Suit
  rank: number
  id: string
}

export type Pile = {
  cards: Card[]
}

export type PlayerState = {
  hand: Card[]
  drawPile: Pile
  id: string
  canPlay: boolean
}

export type GameState = {
  players: PlayerState[]
  playPiles: Pile[]
  drawPiles: Pile[]
  status: "waiting" | "in_progress" | "finished"
  winner?: string
}

export type Move =
  | { type: "PLAY_CARD"; playerId: string; cardId: string; pileIndex: number }
  | { type: "DRAW_CARD"; playerId: string }
  | { type: "CANNOT_PLAY"; playerId: string }