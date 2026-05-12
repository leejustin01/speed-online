import { useState } from "react"

import { socket } from "./socket"

import Home from "./pages/Home"
import Room from "./pages/Room"


export default function App() {
    const [roomId, setRoomId] = useState<string | null>(null)
    
    if (!roomId) {
        return <Home setRoomId={setRoomId}/>
    }

    const onLeave = () => {
        socket.emit("leave_room", {
            roomId: roomId
        })
        setRoomId(null)   
    }

    return <Room roomId={roomId} onLeave={onLeave}/>;
}