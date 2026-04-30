import { reducer } from "@game/game-engine"
import { getRoom } from "../../roomState"

import { TypedServer, TypedSocket } from "@game/types"
import { PlayerMovePayload } from "@game/protocol"
import { cloneState } from "packages/game-engine/src/gameEngine"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export async function onPlayerMove(
    io: TypedServer,
    socket: TypedSocket,
    data: PlayerMovePayload
) {
    const { roomId, move } = data

    const room = getRoom(roomId)
    if (!room) {
        socket.emit("error_message", "Room not found.")
        return
    }

    if (room.isResolving) {
        socket.emit("error_message", "Wait for countdown.")
        return
    }

    const result = reducer(cloneState(room.state), move)

    if (result.message === "INVALID_MOVE") {
        socket.emit("invalid_move")
        return
    }

    room.state = result.state
    
    if (result.message === "FLIP_CARDS") {
        room.isResolving = true
        io.to(roomId).emit("flip_cards_countdown")
        await delay(3000)
        room.isResolving = false
    } else if (result.message === "GAME_OVER") {
        if (!result.state.winner) {
            io.to(roomId).emit("error_message", "winner is undefined")
            return
        }
        io.to(roomId).emit("game_over", result.state.winner)
    }

    
    io.to(roomId).emit("state_update", {
        state: room.state
    })
}