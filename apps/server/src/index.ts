import { createServer } from "http"
import { initWebSocket } from "./ws/websocketServer"

const httpServer = createServer()

initWebSocket(httpServer)

const PORT = 3000

httpServer.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`)
})