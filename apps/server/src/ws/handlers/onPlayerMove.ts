import { reducer } from "@game/game-engine"
import { getRoom } from "../../roomState"

import { TypedServer, TypedSocket } from "@game/types"
import { PlayerMovePayload } from "@game/protocol"
import { cloneState } from "packages/game-engine/src/gameEngine"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export async function onPlayerMove(
    io: TypedServer,
    socket: TypedSocket,
    data: PlayerMovePayload
) {
    const { roomId, move } = data

    const room = getRoom(roomId)
    if (!room) {
        console.log("===> Sending: error_message")
        socket.emit("error_message", "Room not found.")
        return
    }

    if (room.isResolving) {
        console.log("===> Sending: error_message")
        socket.emit("error_message", "Wait for countdown.")
        return
    }
    const result = reducer(cloneState(room.state), move)
    
    if (result.message === "INVALID_MOVE") {
        console.log("===> Sending: invalid_move")
        socket.emit("invalid_move")
        return
    }

    const tempState = cloneState(room.state)
    room.state = result.state
    
    if (result.message === "FLIP_CARDS") {
        room.isResolving = true

        tempState.status = "waiting"
        io.to(roomId).emit("state_update", {
            state: tempState
        })

        console.log("===> Sending: countdown_3")
        io.to(roomId).emit("countdown_3")
        await delay(1000)
        console.log("===> Sending: countdown_2")
        io.to(roomId).emit("countdown_2")
        await delay(1000)
        console.log("===> Sending: countdown_1")
        io.to(roomId).emit("countdown_1")
        await delay(1000)
        room.isResolving = false
    } else if (result.message === "GAME_OVER") {
        if (!result.state.winner) {
            console.log("===> Sending: game_over (tie)")
            io.to(roomId).emit("game_over", "tie")
            return
        }
        console.log("===> Sending: game_over")
        io.to(roomId).emit("game_over", result.state.winner)
    }

    console.log("===> Sending: status_update")
    io.to(roomId).emit("state_update", {
        state: room.state
    })
}