import { memo, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameState, ARCADE_TUNING } from '../store/useGameStore'

const ArcadeCoin = memo(function ArcadeCoin({ x, lane, collected, active }) {
    const ref = useRef()
    const centerLane = Math.floor(ARCADE_TUNING.laneCount / 2)
    const z = (lane - centerLane) * ARCADE_TUNING.laneWidth
    const baseY = 0.82

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * (active ? 5.5 : 1.25)
            ref.current.position.y = baseY + Math.sin(ref.current.rotation.y * 0.8) * (active ? 0.08 : 0.03)
        }
    })

    if (collected) return null

    return (
        <group ref={ref} position={[x, baseY, z]}>
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
                <meshStandardMaterial
                    color="#FFD54F"
                    emissive="#FFB300"
                    emissiveIntensity={active ? 0.55 : 0.14}
                    metalness={0.6}
                    roughness={0.3}
                />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.06]}>
                <ringGeometry args={[0.32, 0.56, 24]} />
                <meshBasicMaterial
                    color="#FFD54F"
                    transparent
                    opacity={active ? 0.22 : 0.08}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
})

const ArcadeObstacle = memo(function ArcadeObstacle({ x, lane }) {
    const centerLane = Math.floor(ARCADE_TUNING.laneCount / 2)
    const z = (lane - centerLane) * ARCADE_TUNING.laneWidth

    return (
        <group position={[x, 0, z]}>
            <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
                <boxGeometry args={[0.8, 0.8, 1.6]} />
                <meshStandardMaterial
                    color="#ef4444"
                    emissive="#991b1b"
                    emissiveIntensity={0.3}
                    roughness={0.7}
                />
            </mesh>
            <mesh position={[0, 0.85, 0]}>
                <boxGeometry args={[0.05, 0.9, 1.8]} />
                <meshStandardMaterial
                    color="#fbbf24"
                    emissive="#f59e0b"
                    emissiveIntensity={0.5}
                />
            </mesh>
        </group>
    )
})

export default function ArcadeProps({ spawns }) {
    const position = useGameState((s) => s.position)
    const collectedCoinIds = useGameState((s) => s.collectedCoinIds)
    const balanceMode = useGameState((s) => s.balanceMode)
    const viewDistance = 80
    const behind = 10
    const coinsActive = balanceMode !== 'grounded'
    const positionBucket = Math.floor(position / 6)
    const visibleStart = positionBucket * 6 - behind
    const visibleEnd = positionBucket * 6 + viewDistance
    const visibleCoins = useMemo(
        () => spawns ? spawns.coins.filter((c) => c.x > visibleStart && c.x < visibleEnd) : [],
        [spawns, visibleEnd, visibleStart],
    )
    const visibleObstacles = useMemo(
        () => spawns ? spawns.obstacles.filter((o) => o.x > visibleStart && o.x < visibleEnd) : [],
        [spawns, visibleEnd, visibleStart],
    )

    if (!spawns) return null

    return (
        <>
            {visibleCoins.map((coin) => (
                <ArcadeCoin
                    key={`coin-${coin.id}`}
                    x={coin.x}
                    lane={coin.lane}
                    collected={collectedCoinIds.has(coin.id)}
                    active={coinsActive}
                />
            ))}
            {visibleObstacles.map((obs) => (
                <ArcadeObstacle
                    key={`obs-${obs.id}`}
                    x={obs.x}
                    lane={obs.lane}
                />
            ))}
        </>
    )
}
