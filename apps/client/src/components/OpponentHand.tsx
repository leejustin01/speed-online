import CardBack from "./CardBack";
import "./Hand.css"

export default function OpponentHand({ count }: { count: number}) {
    return (
        <>
            <ul className="hand">
                {[...Array(count)].map((_, i) =>
                    <li key={i}>
                        <CardBack />
                    </li>
                )}
            </ul>
        </>
    )
}