import type { Card } from "@game/types";
import { useDrop } from "react-dnd";
import CardBack from "./CardBack";
import "./PlayPile.css";
import PileCard from "./PileCard";

export default function PlayPile({ faceUp, topCard, pileIdx, handlePlay }: { faceUp: boolean, topCard: Card, pileIdx: number, handlePlay: (pileIdx: number, cardId?: string) => void }) {

    const [{ isOver }, drop ] = useDrop(() => ({
        accept: "card",
        drop: (item: {cardId: string}) => handlePlay(pileIdx, item.cardId),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }), [pileIdx, handlePlay])

    return (
        <div 
            className={`playpile ${faceUp ? "" : "flipped"}`}
            ref={(node) => {
                drop(node)
            }}
        >
            <div className="playpile-inner">

                <div className="playpile-back">
                    <CardBack/>
                </div>

                <div className="playpile-front" onClick={() => handlePlay(pileIdx)}>
                    <PileCard card={topCard}/>
                </div>

            </div>
        </div>
    );
}