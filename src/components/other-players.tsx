import { Vector3 } from "three"
import { Body } from "./snake"

export function OtherPlayers({
  players,
}: {
  players: { color: string; body: Vector3[] }[]
}) {
  return (
    <>
      {players.map((player, index) => (
        <Body key={index} points={player.body} color={player.color} />
      ))}
    </>
  )
}
