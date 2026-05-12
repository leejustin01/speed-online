import CardBack from "./CardBack";

export default function DrawPile({ count, handleDraw }: { count: number, handleDraw?: () => void }) {
    return (
        <CardBack count={count} handleDraw={handleDraw}/>
    )
}