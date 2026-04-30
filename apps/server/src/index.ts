import { createServer } from "http"
import { Server } from "socket.io"
import { generateRoomCode, createRoom, joinRoom, removePlayer } from "./roomState"
import { ClientToServerEvents, ServerToClientEvents } from "@game/protocol"
import { initWebSocket } from "./ws/websocketServer"

const httpServer = createServer()

initWebSocket(httpServer)

const PORT = 3000

httpServer.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`)
})