// setup socket.io server without express
import { ClientToServerEvents, GameState, ServerToClientEvents } from "@/types"
import { Server } from "socket.io"

const io = new Server<ClientToServerEvents, ServerToClientEvents>(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

const gameState: GameState = {
  players: {},
}

io.on("connection", (socket) => {
  const name = (socket.handshake.query.name as string) || socket.id
  console.log("a user connected:", name)

  gameState.players[name] = {
    body: [{ x: 0, y: 0, z: 0 }],
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  }

  socket.on("client:new-head-pos", (pos) => {
    const body = gameState.players[name].body
    body.push(pos)
    if (body.length > 10) {
      body.shift()
    }
  })

  socket.on("disconnect", () => {
    console.log("user disconnected:", name)
    delete gameState.players[name]
  })
})

setInterval(() => io.emit("server:state-update", gameState), 1000 / 30)

console.log("socket.io server running on port 3001")
