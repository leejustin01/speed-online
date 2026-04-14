import { Suit, Card, PlayerState, GameState, Move } from "@game/types"

export function createDeck(): Card[] {
    let deck: Card[] = []
    for (let i = 0; i < 13; i++) {
        // rank goes 0 - 12
        // id goes 1d for Ace of diamonds to 13c for king of clubs
        let diamond: Card = { suit: "diamonds", rank: i, id: (i + 1) + "d" }
        let heart: Card = { suit: "hearts", rank: i, id: (i + 1) + "h" }
        let spade: Card = { suit: "spades", rank: i, id: (i + 1) + "s" }
        let club: Card = { suit: "clubs", rank: i, id: (i + 1) + "c" }

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
    // fisher-yates shuffle algorithm source: https://www.geeksforgeeks.org/dsa/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/

    for (let i = deck.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1))

        const temp = deck[j]
        deck[j] = deck[i]
        deck[i] = temp
    }

    return deck
}

// Deals 5 cards to players' hands and 15 to their draw piles stored in PlayerState
// Deals 6 cards to the center draw piles returned in drawPiles property
// Expects input deck to be shuffled
export function dealCards(
    players: PlayerState[], 
    deck: Card[]
): {
  players: PlayerState[]
  drawPiles: Card[][]
} {
    let cardToBeDealt = 0
    const player1 = players[0]
    const player2 = players[1]

    for (let i = 0; i < 5; i++) {
        player1.hand.push(deck[cardToBeDealt++])
        player2.hand.push(deck[cardToBeDealt++])
    }

    for (let i = 0; i < 15; i++) {
        player1.drawPile.push(deck[cardToBeDealt++])
        player2.drawPile.push(deck[cardToBeDealt++])
    }

    const drawPiles: Card[][] = [[], []]
    for (let i = 0; i < 6; i++) {
        drawPiles[0][i] = deck[cardToBeDealt++]
        drawPiles[1][i] = deck[cardToBeDealt++]
    }

    return { players, drawPiles }
}