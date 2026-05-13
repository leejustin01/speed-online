import { createServer } from "http"
import { initWebSocket } from "./ws/websocketServer"

const httpServer = createServer()

initWebSocket(httpServer)

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Server running on  http://localhost:${port}`)
})