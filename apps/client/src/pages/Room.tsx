import { useEffect, useState } from "react"

import type { GameState } from "@game/types"
import { socket } from "../socket"

import Board from "./Board"

import "./Room.css"


export default function Room({
    roomId,
    onLeave,
}: {
    roomId: string;
    onLeave: () => void;
}) {

    const [game, setGame] = useState<GameState | null>(null)
    const [playerIdx, setPlayerIdx] = useState<number>(1)

    const [players, setPlayers] = useState<number>(1)

    useEffect(() => {
        const handleState = (data: { state: GameState }) => {
            setGame(data.state)
        }

        const handleInit = (data: { playerIdx: number }) => {
            setPlayerIdx(data.playerIdx)
        }

        const handlePlayerJoined = (data: { players: string[] }) => {
            console.log("received: ",data.players)
            setPlayers(data.players.length)
        }

        const handlePlayerLeft = () => {
            socket.emit("get_players", { roomId: roomId })
        }

        const handlePlayers = (data : { players: string[]}) => {
            setPlayers(data.players.length)
        }

        socket.on("state_update", handleState)
        socket.on("player_init", handleInit)
        socket.on("player_joined", handlePlayerJoined)
        socket.on("player_left", handlePlayerLeft)
        socket.on("players", handlePlayers)

        socket.emit("get_players", { roomId: roomId })
        socket.emit("init", { roomId: roomId })

        return () => {
            socket.off("state_update", handleState)
            socket.off("player_init", handleInit)
            socket.off("player_joined", handlePlayerJoined)
            socket.off("player_left", handlePlayerLeft)
            socket.off("players", handlePlayers)
        }
    }, [players, roomId])

    useEffect(() => {
        console.log(players)
    }, [players, setPlayers])

    const startGame = () => {
        socket.emit("start_game", { roomId })
    }

    if (game) {
        return <Board game={game} playerIdx={playerIdx} roomId={roomId} onLeave={onLeave}/>
    }

    return (
        <div className="room-container">
            <div className="room-card">

                <h2 className="room-title">Room</h2>

                <div className="room-id">
                    Code: <span>{roomId}</span>
                </div>

                <div className="player-slots">
                    <div className={`player-slot ${players >= 1 ? "filled" : ""}`}>
                        Player 1
                    </div>
                    <div className={`player-slot ${players >= 2 ? "filled" : ""}`}>
                        Player 2
                    </div>
                </div>

                <div className="room-buttons">
                    <button disabled={players !== 2} onClick={startGame}>
                        Start Game
                    </button>

                    <button className="secondary" onClick={onLeave}>
                        Leave Room
                    </button>
                </div>

            </div>
        </div>
    )
}