import type { Card } from "@game/types";

import { useDrag } from "react-dnd";

import "./PlayingCard.css"

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
export default function PlayingCard({ card, index }: { card: Card, index?: number }) {
    const [{isDragging}, drag] = useDrag(() => ({
        type: "card",
        item: {
            card
        },
        collect: monitor => ({
        isDragging: !!monitor.isDragging(),
        }),
    }), [card])

    const isRed =
        card.suit === "hearts" ||
        card.suit === "diamonds"

    const suit = suitSymbols[card.suit]
    const rank = rankLabels[card.rank] || card.rank + 1
    
    return (
        <div
            className={`card ${isRed ? "red" : "black"}`}
            ref={(node) => {
                drag(node)
            }}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: "move",
            }}
        >
            {index !== undefined && (
                <div className="card-index">
                    {index}
                </div>
            )}

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