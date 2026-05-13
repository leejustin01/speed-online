import { io, Socket } from "socket.io-client"

import type {
  ClientToServerEvents,
  ServerToClientEvents
} from "@game/protocol"

export const socket: Socket<
  ServerToClientEvents,
  ClientToServerEvents
> = io(import.meta.env.VITE_SERVER_URL)