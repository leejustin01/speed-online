import { useEffect, useState } from "react";
import { socket } from "../socket";

import type { GameState } from "@game/types";
import Board from "./Board";

export default function Room({
    roomId,
    onLeave,
}: {
    roomId: string;
    onLeave: () => void;
}) {

    const [game, setGame] = useState<GameState | null>(null)
    const [playerIdx, setPlayerIdx] = useState<number>(0)
    
    useEffect(() => {
        socket.on("state_update", (data) => {
            setGame(data.state)
        })

        socket.on("player_init", (data) => {
            setPlayerIdx(data.playerIdx)
        })
        
        return () => {
            socket.off("state_update")
        }
    }, [])

    const startGame = () => {
        socket.emit("start_game", { roomId: roomId })
    }

    return (
        ((game !== null && <Board game={game} playerIdx={playerIdx} roomId={roomId}/>) || <div>
            <h2>Room: {roomId}</h2>

            <button onClick={onLeave} style={{ marginLeft: 10 }}>
                Leave
            </button>

            <button onClick={startGame}>
                Start Game
            </button>
        
        </div>)
    )
}