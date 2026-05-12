import "./CardBack.css";

export default function CardBack({ count, handleDraw }: { count?: number, handleDraw?: () => void }) {
    return (
        <div className="card-back-wrapper" onClick={handleDraw}>
            <div className="card-back" />

            {count !== undefined && (
                <div className="card-back-count">
                    {count}
                </div>
            )}
        </div>
    )
}