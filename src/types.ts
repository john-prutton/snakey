// make server and client types for socket.io
export interface ServerToClientEvents {
  "server:state-update": (state: GameState) => void
}

export interface ClientToServerEvents {
  "client:new-head-pos": (pos: { x: number; y: number; z: number }) => void
  "client:join-game": (name: string) => void
}

export interface GameState {
  players: {
    [key: string]: {
      color: string
      body: { x: number; y: number; z: number }[]
    }
  }
}
