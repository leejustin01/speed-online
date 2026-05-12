import type { Card } from "@game/types"
import "./PileCard.css"

const suitSymbols: Record<Card["suit"], string> = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
}

const rankLabels: Record<number, string> = {
    0: "A",
    10: "J",
    11: "Q",
    12: "K",
}
export default function PileCard({ card }: { card: Card }) {
    const isRed =
        card.suit === "hearts" ||
        card.suit === "diamonds"

    const suit = suitSymbols[card.suit]
    const rank = rankLabels[card.rank] || card.rank + 1
    
    return (
        <div
            className={`pile-card ${isRed ? "red" : "black"}`}
        >
            <div className="card-corner-top">
                <div className="card-corner-rank">
                    {rank}
                </div>

                <div className="card-corner-suit">
                    {suit}
                </div>
            </div>

            <div className="card-center">
                {suit}
            </div>

            <div className="card-corner-bottom">
                <div className="card-corner-rank">
                    {rank}
                </div>

                <div className="card-corner-suit">
                    {suit}
                </div>
            </div>
        </div>
    )
}