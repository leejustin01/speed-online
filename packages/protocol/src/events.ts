import { Move, GameState } from "@game/types"

export type PlayerMovePayload = {
    roomId: string,
    move: Move
}

export type ClientToServerEvents = {
    create_room: () => void

    join_room: (data: {
        roomId: string
    }) => void

    player_move: (data: PlayerMovePayload) => void
}

export type ServerToClientEvents = {
    room_created: (data: {
        roomId: string
    }) => void

    player_joined: (data: {
        players: string[]
    }) => void

    state_update: (data: {
        state: GameState
    }) => void

    join_error: (error: string) => void

    player_left: (data: {
        playerId: string
    }) => void

    invalid_move: () => void

    error_message: (message: string) => void

    flip_cards_countdown: () => void
    
    game_over: (winner: string) => void
}