import { useDrop } from "react-dnd"

import type { Card } from "@game/types"

import CardBack from "./CardBack"
import PileCard from "./PileCard"

import "./PlayPile.css"

export default function PlayPile({ 
    faceUp, 
    topCard, 
    pileIdx, 
    handlePlay 
}: { 
    faceUp: boolean, 
    topCard: Card, 
    pileIdx: number, 
    handlePlay: (pileIdx: number, cardId?: string) => void 
}) {

    const [{ isOver }, drop ] = useDrop(() => ({
        accept: "card",
        drop: (item: {cardId: string}) => handlePlay(pileIdx, item.cardId),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }), [pileIdx, handlePlay])

    return (
        <div 
            className={`playpile ${faceUp ? "" : "flipped"} ${isOver ? "hovered" : ""}`}
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