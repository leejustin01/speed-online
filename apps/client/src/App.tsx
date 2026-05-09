import { useState } from "react"
import Home from "./pages/Home"
import Room from "./pages/Room"
import { socket } from "./socket"

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