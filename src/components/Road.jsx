import { useMemo } from 'react'
import { ROAD_LENGTH, ROAD_WIDTH } from '../store/useGameStore'

const DASH_COUNT = Math.floor(ROAD_LENGTH / 6)
const POST_COUNT = Math.floor(ROAD_LENGTH / 12)
const MOUND_COUNT = Math.floor(ROAD_LENGTH / 18)
const RIDGE_COUNT = Math.floor(ROAD_LENGTH / 32)

function seededNoise(seed) {
    const value = Math.sin(seed * 127.1) * 43758.5453123
    return value - Math.floor(value)
}

export default function Road() {
    const dashes = useMemo(() => {
        const items = []
        for (let i = 0; i < DASH_COUNT; i += 1) {
            items.push(i * 6 + 2.2)
        }
        return items
    }, [])

    const posts = useMemo(() => {
        const items = []
        for (let i = 0; i < POST_COUNT; i += 1) {
            const x = i * 12 + 6
            items.push({ x, z: ROAD_WIDTH * 0.5 + 1.1 })
            items.push({ x, z: -ROAD_WIDTH * 0.5 - 1.1 })
        }
        return items
    }, [])

    const mounds = useMemo(() => {
        const items = []
        for (let i = 0; i < MOUND_COUNT; i += 1) {
            const side = i % 2 === 0 ? 1 : -1
            const x = i * 18 + 10
            const spread = 8 + seededNoise(i + 4) * 8
            const scaleX = 2.4 + seededNoise(i + 11) * 3.2
            const scaleY = 0.7 + seededNoise(i + 17) * 1.4
            const scaleZ = 2 + seededNoise(i + 23) * 3.6

            items.push({
                x,
                y: -0.28 + seededNoise(i + 31) * 0.06,
                z: side * spread,
                scale: [scaleX, scaleY, scaleZ],
                color: side > 0 ? '#8a6b46' : '#7b5d3e',
            })
        }
        return items
    }, [])

    const rocks = useMemo(() => {
        const items = []
        for (let i = 0; i < MOUND_COUNT * 2; i += 1) {
            const side = i % 2 === 0 ? 1 : -1
            items.push({
                x: 5 + i * 9,
                y: 0.04,
                z: side * (6.2 + seededNoise(i + 9) * 4.5),
                scale: 0.18 + seededNoise(i + 19) * 0.5,
                rotation: seededNoise(i + 27) * Math.PI,
            })
        }
        return items
    }, [])

    const ridges = useMemo(() => {
        const items = []
        for (let i = 0; i < RIDGE_COUNT; i += 1) {
            const side = i % 2 === 0 ? 1 : -1
            items.push({
                x: i * 32 + 18,
                y: 1.8 + seededNoise(i + 3) * 1.2,
                z: side * (17 + seededNoise(i + 13) * 4),
                radius: 5 + seededNoise(i + 29) * 4,
                height: 7 + seededNoise(i + 41) * 6,
                color: side > 0 ? '#b38758' : '#9d7449',
            })
        }
        return items
    }, [])

    return (
        <group>
            <mesh position={[ROAD_LENGTH / 2, -0.38, 0]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH + 80, 0.5, 90]} />
                <meshStandardMaterial color="#9e7a4c" roughness={1} />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, -0.08, 0]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.24, ROAD_WIDTH + 0.8]} />
                <meshStandardMaterial color="#34312f" roughness={0.92} metalness={0.05} />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, 0.03, -ROAD_WIDTH / 2 - 0.22]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.03, 0.42]} />
                <meshStandardMaterial color="#c57f39" roughness={0.95} />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, 0.03, ROAD_WIDTH / 2 + 0.22]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.03, 0.42]} />
                <meshStandardMaterial color="#c57f39" roughness={0.95} />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, 0.04, -ROAD_WIDTH / 2 + 0.3]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.02, 0.16]} />
                <meshStandardMaterial color="#f4e7c2" />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, 0.04, ROAD_WIDTH / 2 - 0.3]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.02, 0.16]} />
                <meshStandardMaterial color="#f4e7c2" />
            </mesh>

            {dashes.map((x) => (
                <mesh key={x} position={[x, 0.05, 0]} receiveShadow>
                    <boxGeometry args={[2.8, 0.02, 0.16]} />
                    <meshStandardMaterial color="#f4bf42" emissive="#b5781a" emissiveIntensity={0.15} />
                </mesh>
            ))}

            {posts.map((post) => (
                <group key={`${post.x}-${post.z}`} position={[post.x, 0.1, post.z]}>
                    <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
                        <boxGeometry args={[0.08, 0.9, 0.08]} />
                        <meshStandardMaterial color="#f3dfbb" roughness={0.75} />
                    </mesh>
                    <mesh castShadow position={[0, 0.92, 0]}>
                        <boxGeometry args={[0.16, 0.14, 0.14]} />
                        <meshStandardMaterial color="#ff9b42" emissive="#d3641f" emissiveIntensity={0.25} />
                    </mesh>
                </group>
            ))}

            {mounds.map((mound) => (
                <mesh
                    key={`${mound.x}-${mound.z}`}
                    position={[mound.x, mound.y, mound.z]}
                    scale={mound.scale}
                    castShadow
                    receiveShadow
                >
                    <sphereGeometry args={[1, 18, 18]} />
                    <meshStandardMaterial color={mound.color} roughness={1} />
                </mesh>
            ))}

            {rocks.map((rock) => (
                <mesh
                    key={`${rock.x}-${rock.z}`}
                    position={[rock.x, rock.y, rock.z]}
                    rotation={[rock.rotation * 0.5, rock.rotation, 0]}
                    scale={rock.scale}
                    castShadow
                    receiveShadow
                >
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#6d5440" roughness={1} />
                </mesh>
            ))}

            {ridges.map((ridge) => (
                <mesh
                    key={`${ridge.x}-${ridge.z}`}
                    position={[ridge.x, ridge.y, ridge.z]}
                    rotation={[0, 0, 0]}
                    castShadow
                    receiveShadow
                >
                    <coneGeometry args={[ridge.radius, ridge.height, 6]} />
                    <meshStandardMaterial color={ridge.color} roughness={1} />
                </mesh>
            ))}
        </group>
    )
}
