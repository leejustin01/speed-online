import type { Card } from "@game/types";
import PlayingCard from "./PlayingCard";

import "./Hand.css"

export default function MyHand({ hand, selectedCardIdx, setSelectedCardIdx }: { hand: Card[], selectedCardIdx: number | null, setSelectedCardIdx: React.Dispatch<React.SetStateAction<number | null>>}) {
    return (
        <ul className="hand">
            {hand?.map((card, i) => (
                <li key={card.id ?? i}>
                    <PlayingCard card={card} index={i+1} selected={selectedCardIdx === i} setSelectedCardIdx={setSelectedCardIdx}/>
                </li>
            ))}
        </ul>
    )
}