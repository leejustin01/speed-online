import { Suit, Card, PlayerState, Pile, GameState, Move } from "@game/types"

export function createDeck(): Card[] {
    let deck: Card[] = []
    for (let i = 1; i <= 13; i++) {
        let diamond: Card = { suit: "diamonds", rank: i, id: i + "d" }
        let heart: Card = { suit: "hearts", rank: i, id: i + "h" }
        let spade: Card = { suit: "spades", rank: i, id: i + "s" }
        let club: Card = { suit: "clubs", rank: i, id: i + "c" }

        deck.push(diamond)
        deck.push(heart)
        deck.push(spade)
        deck.push(club)
    }

    return deck
}

export function shuffle(
    deck: Card[]
): Card[] {
    throw new Error("not implemented")
}

export function dealCards(
    players: PlayerState[], 
    deck: Card[]
): {
  players: PlayerState[]
  drawPiles: Card[]
} {
    throw new Error("not implemented")
}