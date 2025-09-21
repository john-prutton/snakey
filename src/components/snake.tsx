import { PerspectiveCamera as Camera } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Mesh, PerspectiveCamera, Vector3 } from "three"

export function Snake({ headRef }: { headRef: React.RefObject<Mesh> }) {
  const cameraRef = useRef<PerspectiveCamera>(null)
  const [points, setPoints] = useState<Vector3[]>([new Vector3(0, 0, 0)])
  const length = useRef(10)

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      headRef.current?.position.set(0, 0, 0)
    }, 10_000)

    const interval = setInterval(() => {
      const head = headRef.current
      if (!head) return

      setPoints((points) => {
        const newPoints = [...points, head.position.clone()]
        if (newPoints.length > length.current) {
          newPoints.shift()
        }

        return newPoints
      })
    }, 250)

    return () => {
      clearInterval(interval)
      clearInterval(refreshInterval)
    }
  }, [headRef])

  useFrame((state, delta) => {
    if (!headRef.current || !cameraRef.current) return

    const head = headRef.current
    const mousePosition =
      state.pointer.lengthSq() === 0 ? { x: 1, y: 1 } : state.pointer

    const newPosition = head.position
      .clone()
      .add(
        new Vector3(mousePosition.x, 0, -mousePosition.y)
          .normalize()
          .multiplyScalar(2 * delta)
      )

    head.lookAt(newPosition)
    head.position.copy(newPosition)
    cameraRef.current.position.copy(newPosition).add(new Vector3(0, 10, 0))
  })

  return (
    <group>
      <Camera
        ref={cameraRef}
        makeDefault
        rotation={[-Math.PI / 2.0, 0, 0]}
        fov={50}
      />

      {/* Head */}
      <mesh ref={headRef}>
        <meshToonMaterial color="red" />
        <sphereGeometry args={[0.25, 20, 0.9]} />
      </mesh>

      <Body points={points} />
    </group>
  )
}

export function Body({ points, color }: { points: Vector3[]; color?: string }) {
  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <meshToonMaterial color={color || "white"} />
          <sphereGeometry args={[0.25, 100, 0.9]} />
        </mesh>
      ))}
    </group>
  )
}
