import { initializeGame } from "@game/game-engine"
import { GameState } from "@game/types"
import { setPlayerId } from "packages/game-engine/src/gameEngine"

type Room = {
    id: string
    players: string[],
    state: GameState,
    isResolving: boolean
}

const rooms = new Map<string, Room>()

export function createRoom(id: string, playerId: string) {
    rooms.set(id, {
        id,
        players: [playerId],
        state: initializeGame([playerId, ""]),
        isResolving: false
    })
}

export function getRoom(id: string) {
    return rooms.get(id)
}

export function setRoomState(id: string, state: GameState) {
    const room = rooms.get(id)
    if (!room) return { error: "ROOM_NOT_FOUND" }
    if (!room.state) return { error: "GAME_NOT_INITIALIZED" }

    room.state = state
    
}

export function joinRoom(id: string, playerId: string) {
    const room = rooms.get(id)
    if (!room) return { error: "ROOM_NOT_FOUND" }

    for (const player of room.players) {
        if (player === playerId) {
            return { error: "ALREADY_IN_ROOM"}
        }
    }

    if (room.players.length >= 2) {
        return { error: "ROOM_FULL" }
    }

    room.players.push(playerId)

    if (room.players.length === 2) {
        setPlayerId(room.state, 1, playerId)
    }

    return { room }
}

export function generateRoomCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString()
}

export function removePlayer(playerId: string) {
    for (const [roomId, room] of rooms) {
        const index = room.players.indexOf(playerId)

        if (index !== -1) {
            room.players.splice(index, 1)

            if (room.players.length === 0) {
                rooms.delete(roomId)
            }

            return roomId
        }
    }
}