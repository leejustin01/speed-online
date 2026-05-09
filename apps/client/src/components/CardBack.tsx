import "./CardBack.css";

export default function CardBack({ count }: { count?: number }) {
    return (
        <div className="card-back-wrapper">
            <div className="card-back" />

            {count !== undefined && (
                <div className="card-back-count">
                    {count}
                </div>
            )}
        </div>
    )
}