import type { Move, GameState } from "./game"

export type PlayerMovePayload = {
    roomId: string,
    move: Move
}

export type ClientToServerEvents = {
    create_room: () => void

    join_room: (data: {
        roomId: string
    }) => void

    leave_room: (data: {
        roomId: string
    }) => void

    start_game: (data: {
        roomId: string
    }) => void

    get_players: (data: {
        roomId: string
    }) => void

    init: (data: {
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

    lobby_update: (data: {
        players: string[]
    }) => void

    player_init: (data: {
        playerIdx: number
    }) => void

    state_update: (data: {
        state: GameState
    }) => void

    join_error: (error: string) => void

    leave_error: (error: string) => void

    join_success: () => void

    leave_success: () => void

    player_left: (data: {
        playerId: string
    }) => void

    players: (data: {
        players: string[]
    }) => void
    

    invalid_move: () => void

    error_message: (message: string) => void

    countdown_1: () => void

    countdown_2: () => void

    countdown_3: () => void
    
    game_over: (winner: number) => void
}