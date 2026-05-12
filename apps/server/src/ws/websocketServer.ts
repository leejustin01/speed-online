import { Server } from "socket.io"
import { Server as HTTPServer } from "http"
import { ClientToServerEvents, ServerToClientEvents } from "@game/protocol"
import { generateRoomCode, createRoom, joinRoom, removePlayer, leaveRoom, getRoom } from "../roomState"
import { onPlayerMove } from "./handlers/onPlayerMove"
import { initializeGame } from "@game/game-engine"

type IOServer = Server<ClientToServerEvents, ServerToClientEvents>

export function initWebSocket(httpServer: HTTPServer): IOServer {
    const io: IOServer = new Server(httpServer, {
        cors: { origin: "*" }
    })

    io.on("connection", (socket) => {
        console.log("Connected:", socket.id)

        socket.on("create_room", () => {
            console.log("<=== Received: create_room")
            const roomId = generateRoomCode()
            
            createRoom(roomId, socket.id)
    
            socket.join(roomId)
    
            console.log("===> Sending: room_created")
            socket.emit("room_created", { roomId })
            const room = getRoom(roomId)
            if (!room) {
                console.log("===> Sending: error_message")
                socket.emit("error_message", "ROOM_NOT_FOUND")
                return
            }
            const playerIdx = room.players.indexOf(socket.id)
            if (playerIdx === -1) {
                console.log("===> Sending: error_message")
                socket.emit("error_message", "PLAYER_NOT_FOUND")
                return
            }
            console.log("===> Sending: player_init")
            socket.emit("player_init", { playerIdx: playerIdx })
        })

        socket.on("join_room", (data) => {
            console.log("<=== Received: join_room")
            const result = joinRoom(data.roomId, socket.id)
        
            if (result?.error || !result.room) {
                console.log("===> Sending: join_error")
                socket.emit("join_error", result.error)
                return
            }

            console.log("===> Sending: join_success")
            socket.emit("join_success")
        
    
            socket.join(data.roomId)
    
            console.log("===> Sending: player_joined")
            io.to(data.roomId).emit("player_joined", {
                players: result.room.players
            })

            const playerIdx = result.room.players.indexOf(socket.id)
            if (playerIdx === -1) {
                console.log("===> Sending: error_message")
                socket.emit("error_message", "PLAYER_NOT_FOUND")
                return
            }

            socket.emit("player_init", { playerIdx: playerIdx })
        })

        socket.on("start_game", (data) => {
            console.log("<=== Received: start_game")
            const room = getRoom(data.roomId)
            if (!room) {
                console.log("===> Sending: error_message")
                socket.emit("error_message", "ROOM_NOT_FOUND")
                return
            }

            room.state.status = "in_progress"
            io.to(data.roomId).emit("state_update", {
                state: room.state
            })
        })

        socket.on("leave_room", (data) => {
            console.log("<=== Received: leave_room")
            const result = leaveRoom(data.roomId, socket.id)

            if (result?.error) {
                console.log("===> Sending: leave_error")
                socket.emit("leave_error", result.error)
                return
            }

            console.log("===> Sending: leave_success")
            socket.emit("leave_success")

            if (result.room) {
                io.to(data.roomId).emit("player_left", {
                    playerId: socket.id
                })
            }
        })

        socket.on("get_players", (data) => {
            console.log("<=== Received: get_players")
            const room = getRoom(data.roomId)
            if (!room) {
                console.log("===> Sending: error_message")
                socket.emit("error_message", "ROOM_NOT_FOUND")
                return
            }
            console.log("===> Sending: players")
            socket.emit("players", { players: room.players })
        })

        socket.on("disconnect", (reason) => {
            console.log("Disconnected:", reason)
            const roomId = removePlayer(socket.id)
            
            if (roomId) {
                console.log("===> Sending: player_left")
                io.to(roomId).emit("player_left", {
                    playerId: socket.id
                })
            }
        })

        socket.on("player_move", (data) => {
            console.log("<=== Received: player_move")
            onPlayerMove(io, socket, data)
        })

    })

    console.log("WebSocket initialized")
    return io
}