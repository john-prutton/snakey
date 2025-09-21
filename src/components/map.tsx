export function Map() {
  return (
    <group>
      <directionalLight
        position={[-10, 1, 5]}
        rotation={[0, 0, 0]}
        intensity={10}
        color={"white"}
      />

      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshToonMaterial color="green" />
      </mesh>
    </group>
  )
}
