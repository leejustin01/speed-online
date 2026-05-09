import type { Card } from "@game/types";
import PlayingCard from "./PlayingCard";

import "./Hand.css"

export default function MyHand({ hand }: { hand: Card[]}) {
    return (
        <ul className="hand">
            {hand?.map((card, i) => (
                <li key={card.id ?? i}>
                    <PlayingCard card={card} index={i} />
                </li>
            ))}
        </ul>
    )
}