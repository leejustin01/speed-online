import { Server, Socket } from "socket.io"
import {
  ClientToServerEvents,
  ServerToClientEvents
} from "./protocol"

export type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents
>

export type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents
>