import { useEffect, useState } from "react";
import { socket } from "../socket";

import "./Home.css"

type useStateSetter = {
    setRoomId: React.Dispatch<React.SetStateAction<string | null>>
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function Home({ setRoomId }: useStateSetter) {
    const [roomInput, setRoomInput] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [showControls, setShowControls] = useState(false)

    useEffect(() => {
        const handleRoomCreated = (data: { roomId: string }) => {
            setRoomId(data.roomId)
        }

        const handleJoinSuccess = () => {
            setRoomId(roomInput)
        }

        const handleJoinError = async (error: string) => {
            setError("Error joining room: " + error)
            await delay(2000)
            setError(null)
        }

        socket.on("room_created", handleRoomCreated)
        socket.on("join_success", handleJoinSuccess)
        socket.on("join_error", handleJoinError)

        return () => {
            socket.off("room_created", handleRoomCreated)
            socket.off("join_success", handleJoinSuccess)
            socket.off("join_error", handleJoinError)
        }
    }, [setRoomId, roomInput])

    return (
        <div className="home-container">
            <div className="home-card">

                <h1 className="title">Lobby</h1>

                <div className="button-row">
                    <button onClick={() => socket.emit("create_room")}>
                        Create Room
                    </button>

                    <button onClick={() => setShowControls(!showControls)}>
                        Controls
                    </button>
                </div>

                <div className="join-row">
                    <input
                        placeholder="Room ID"
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value)}
                    />
                    <button onClick={() =>
                        socket.emit("join_room", { roomId: roomInput })
                    }>
                        Join Room
                    </button>
                </div>

                {error && (
                    <div className="error-message show">
                        {error}
                    </div>
                )}

                {showControls && (
                    <div className="controls-panel">
                        <h3>Controls</h3>

                        <ul>
                            <li><b>Drag & Drop</b> cards to play</li>
                            <li><b>1–5</b>: select a card</li>
                            <li><b>Click pile</b>: play selected card</li>
                            <li><b>R</b>: draw a card</li>
                            <li><b>Esc</b>: deselect card</li>
                        </ul>
                    </div>
                )}

            </div>
        </div>
    )
}