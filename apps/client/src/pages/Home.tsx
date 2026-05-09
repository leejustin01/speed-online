import { useEffect, useState } from "react";
import { socket } from "../socket";

type useStateSetter = {
    setRoomId: React.Dispatch<React.SetStateAction<string | null>>
}
export default function Home({ setRoomId }: useStateSetter) {
    const [roomInput, setRoomInput] = useState("");

    useEffect(() => {
        socket.on("room_created", (data) => {
            setRoomId(data.roomId)
        })

        socket.on("join_success", () => {
            setRoomId(roomInput)
        })

        return () => {
            socket.off("room_created")
        }
    }, [setRoomId, roomInput])

    return (
        <div style={{ padding: 20 }}>
        <h1>Lobby</h1>

        <button onClick={() => socket.emit("create_room")}>Create Room</button>

        <div style={{ marginTop: 20 }}>
            <input
            placeholder="Room ID"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            />
            <button onClick={() => socket.emit("join_room", { roomId: roomInput })}>Join Room</button>
        </div>
        </div>
    )
}