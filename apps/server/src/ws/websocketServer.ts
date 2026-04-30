import { Server } from "socket.io"
import { Server as HTTPServer } from "http"
import { ClientToServerEvents, ServerToClientEvents } from "@game/protocol"
import { generateRoomCode, createRoom, joinRoom, removePlayer } from "../roomState"
import { onPlayerMove } from "./handlers/onPlayerMove"

type IOServer = Server<ClientToServerEvents, ServerToClientEvents>

export function initWebSocket(httpServer: HTTPServer): IOServer {
    const io: IOServer = new Server(httpServer, {
        cors: { origin: "*" }
    })

    io.on("connection", (socket) => {
        console.log("Connected:", socket.id)

        socket.on("create_room", () => {
            const roomId = generateRoomCode()
            
            createRoom(roomId, socket.id)
    
            socket.join(roomId)
    
            socket.emit("room_created", { roomId })
        })

        socket.on("join_room", (data) => {
            const result = joinRoom(data.roomId, socket.id)
        
            if (result?.error || !result.room) {
                socket.emit("join_error", result.error)
                return
            }
    
            socket.join(data.roomId)
    
            io.to(data.roomId).emit("player_joined", {
                players: result.room.players
            })
        })

        socket.on("disconnect", (reason) => {
            console.log("Disconnected:", reason)
            const roomId = removePlayer(socket.id)
            
            if (roomId) {
                io.to(roomId).emit("player_left", {
                    playerId: socket.id
                })
            }
        })

        socket.on("player_move", (data) => {
            onPlayerMove(io, socket, data)
        })

    })

    console.log("WebSocket initialized")
    return io
}