"use client"

import { Canvas } from "@react-three/fiber"
import { Map } from "@/components/map"
import { Snake } from "@/components/snake"
import { OtherPlayers } from "@/components/other-players"
import { Mesh, Vector3 } from "three"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "@/types"
import { useSearchParams } from "next/navigation"

export default function Game() {
  const name = useSearchParams().get("name") || "Player"

  const [isPlaying, setIsPlaying] = useState(false)
  const [players, setPlayers] = useState<{ color: string; body: Vector3[] }[]>(
    []
  )

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      process.env.NEXT_PUBLIC_WSS_URL + "/?name=" + name
    )

    socket.on("connect", () => {
      setIsPlaying(true)
    })

    socket.on("server:state-update", (state) => {
      const players = Object.entries(state.players)
        .filter(([id]) => id !== name)
        .map(([, player]) => ({
          color: player.color,
          body: player.body.map((part) => new Vector3(part.x, part.y, part.z)),
        }))

      setPlayers(players)
    })

    const interval = setInterval(() => {
      socket.emit("client:new-head-pos", headRef.current!.position)
    }, 250)

    return () => {
      socket.disconnect()
      clearInterval(interval)
    }
  }, [])

  const headRef = useRef<Mesh>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!headRef.current) return

      for (const player of players) {
        for (const point of player.body) {
          if (headRef.current.position.distanceTo(point) < 0.5) {
            console.log("collision with other player!")
          }
        }
      }
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [headRef, players])

  return (
    <div className="h-svh">
      <Canvas>
        <Map />

        {/* @ts-expect-error - headRef is always defined when isPlaying is true */}
        {isPlaying && <Snake headRef={headRef} />}

        <OtherPlayers players={players} />

        <mesh position={[2, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshToonMaterial color="blue" />
        </mesh>
      </Canvas>
    </div>
  )
}
