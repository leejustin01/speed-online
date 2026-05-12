import CardBack from "./CardBack"
import "./DrawPile.css"

export default function DrawPile({
    count,
    handleDraw
}: {
    count: number,
    handleDraw?: () => void
}) {

    return (
        <div
            className={`drawpile ${handleDraw ? "clickable" : ""}`}
            onClick={handleDraw}
        >
            <CardBack />

            <div className="drawpile-count">
                {count}
            </div>
        </div>
    )
}