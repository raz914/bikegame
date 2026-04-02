import { useMemo } from 'react'
import { ROAD_LENGTH, ROAD_WIDTH } from '../store/useGameStore'

function seededNoise(seed) {
    const value = Math.sin(seed * 127.1) * 43758.5453123
    return value - Math.floor(value)
}

function scaledCount(baseCount, densityScale, minimum = 0) {
    return Math.max(minimum, Math.round(baseCount * densityScale))
}

function buildRoadDashes(densityScale) {
    const count = scaledCount(Math.floor(ROAD_LENGTH / 6), densityScale, 10)
    const spacing = ROAD_LENGTH / count
    return Array.from({ length: count }, (_, index) => index * spacing + 2.2)
}

function buildReflectorPosts(densityScale) {
    const count = scaledCount(Math.floor(ROAD_LENGTH / 12), densityScale, 8)
    return Array.from({ length: count }, (_, index) => {
        const x = index * (ROAD_LENGTH / count) + 6
        return [
            { x, z: ROAD_WIDTH * 0.5 + 1.15, glow: 0.28 + seededNoise(index + 2) * 0.22 },
            { x, z: -ROAD_WIDTH * 0.5 - 1.15, glow: 0.24 + seededNoise(index + 8) * 0.2 },
        ]
    }).flat()
}

function buildGuardrails(densityScale) {
    const segmentCount = scaledCount(Math.floor(ROAD_LENGTH / 18), densityScale, 8)
    return Array.from({ length: segmentCount }, (_, index) => ({
        x: index * (ROAD_LENGTH / segmentCount) + 9,
        length: 12 + seededNoise(index + 1) * 6,
    }))
}

function buildPalms(densityScale) {
    const count = scaledCount(Math.floor(ROAD_LENGTH / 22), densityScale, 6)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: index * (ROAD_LENGTH / count) + 16,
            z: side * (11 + seededNoise(index + 4) * 4.5),
            height: 3.8 + seededNoise(index + 8) * 2.2,
            lean: (seededNoise(index + 11) - 0.5) * 0.18,
            crown: 1.2 + seededNoise(index + 14) * 0.7,
        }
    })
}

function buildBillboards(densityScale, stageId) {
    const count = scaledCount(stageId === 'city' ? 8 : 6, densityScale, 3)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: index * (ROAD_LENGTH / count) + 22,
            z: side * (10.5 + seededNoise(index + 3) * 3),
            width: 3 + seededNoise(index + 6) * 2,
            height: 1.5 + seededNoise(index + 9) * 1.3,
            poleHeight: 2.8 + seededNoise(index + 12) * 1.4,
            tilt: (seededNoise(index + 18) - 0.5) * 0.08,
            glow: stageId === 'city' ? 0.6 + seededNoise(index + 20) * 0.25 : 0.18,
        }
    })
}

function buildBarriers(densityScale) {
    const count = scaledCount(Math.floor(ROAD_LENGTH / 10), densityScale, 12)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: index * (ROAD_LENGTH / count) + 5,
            z: side * (ROAD_WIDTH * 0.5 + 0.65),
            width: 2.4 + seededNoise(index + 5) * 1.5,
            height: 0.58 + seededNoise(index + 8) * 0.22,
        }
    })
}

function buildBuildings(densityScale) {
    const count = scaledCount(34, densityScale, 12)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: index * (ROAD_LENGTH / count) + 6,
            z: side * (12.5 + seededNoise(index + 2) * 5.5),
            width: 4 + seededNoise(index + 5) * 4,
            height: 8 + seededNoise(index + 7) * 18,
            depth: 4 + seededNoise(index + 11) * 5,
            hueShift: seededNoise(index + 13),
        }
    })
}

function buildCityLights(densityScale) {
    const count = scaledCount(42, densityScale, 16)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: index * (ROAD_LENGTH / count) + 4,
            z: side * (ROAD_WIDTH * 0.5 + 1.8),
            height: 2.8 + seededNoise(index + 9) * 1.6,
            glow: 0.55 + seededNoise(index + 13) * 0.35,
        }
    })
}

function buildDunes(densityScale) {
    const count = scaledCount(Math.floor(ROAD_LENGTH / 18), densityScale, 8)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: index * (ROAD_LENGTH / count) + 10,
            y: -0.3 + seededNoise(index + 31) * 0.08,
            z: side * (8 + seededNoise(index + 4) * 8),
            scale: [
                2.8 + seededNoise(index + 11) * 4,
                0.9 + seededNoise(index + 17) * 1.6,
                2.5 + seededNoise(index + 23) * 4.2,
            ],
            color: side > 0 ? '#b68a58' : '#8f6a43',
        }
    })
}

function buildRocks(densityScale) {
    const count = scaledCount(Math.floor(ROAD_LENGTH / 5), densityScale, 14)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: 4 + index * (ROAD_LENGTH / count),
            y: 0.03,
            z: side * (6.5 + seededNoise(index + 9) * 5.5),
            scale: 0.18 + seededNoise(index + 19) * 0.52,
            rotation: seededNoise(index + 27) * Math.PI,
        }
    })
}

function buildRidges(densityScale, stageId) {
    const count = scaledCount(stageId === 'highway' ? 12 : 10, densityScale, 5)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: index * (ROAD_LENGTH / count) + 18,
            y: stageId === 'highway' ? 1.4 + seededNoise(index + 3) * 0.8 : 1.8 + seededNoise(index + 3) * 1.2,
            z: side * (stageId === 'highway' ? 20 + seededNoise(index + 13) * 5 : 17 + seededNoise(index + 13) * 4),
            radius: stageId === 'highway' ? 6 + seededNoise(index + 29) * 5 : 5 + seededNoise(index + 29) * 4,
            height: stageId === 'highway' ? 5 + seededNoise(index + 41) * 4 : 7 + seededNoise(index + 41) * 6,
            color: side > 0 ? '#bc9062' : '#94704a',
        }
    })
}

function buildCacti(densityScale) {
    const count = scaledCount(16, densityScale, 6)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: index * (ROAD_LENGTH / count) + 12,
            z: side * (9 + seededNoise(index + 4) * 6),
            height: 1.4 + seededNoise(index + 7) * 1.6,
            armHeight: 0.6 + seededNoise(index + 12) * 0.8,
            armOffset: 0.28 + seededNoise(index + 15) * 0.2,
        }
    })
}

function buildJungleTrees(densityScale) {
    const count = scaledCount(26, densityScale, 10)
    return Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? 1 : -1
        return {
            x: index * (ROAD_LENGTH / count) + 8,
            z: side * (8.8 + seededNoise(index + 4) * 5.2),
            trunkHeight: 3.4 + seededNoise(index + 9) * 3.8,
            trunkWidth: 0.24 + seededNoise(index + 12) * 0.22,
            crownWidth: 2.2 + seededNoise(index + 15) * 2.4,
            crownHeight: 2 + seededNoise(index + 18) * 2.3,
            lean: (seededNoise(index + 22) - 0.5) * 0.18,
        }
    })
}

function buildHangingLights(densityScale) {
    const count = scaledCount(18, densityScale, 7)
    return Array.from({ length: count }, (_, index) => ({
        x: index * (ROAD_LENGTH / count) + 12,
        y: 3.6 + seededNoise(index + 2) * 1.3,
        z: index % 2 === 0 ? -6.4 : 6.4,
        glow: 0.28 + seededNoise(index + 7) * 0.22,
    }))
}

function buildHazeBands(enabled, densityScale, stageId) {
    if (!enabled) return []

    const count = scaledCount(stageId === 'city' ? 6 : 4, densityScale, 2)
    return Array.from({ length: count }, (_, index) => ({
        x: ROAD_LENGTH * 0.16 + index * (ROAD_LENGTH / (count + 1)),
        y: 4 + seededNoise(index + 2) * 4,
        z: index % 2 === 0 ? -16 : 16,
        width: 20 + seededNoise(index + 5) * 18,
        height: 8 + seededNoise(index + 8) * 10,
        opacity: stageId === 'city' ? 0.11 : stageId === 'highway' ? 0.09 : 0.08,
        color: stageId === 'city' ? '#98b6ff' : stageId === 'highway' ? '#d8efb1' : '#ffe0b6',
    }))
}

function buildGlowOrbs(enabled, densityScale, stageId) {
    if (!enabled || stageId === 'city') return []

    const count = scaledCount(6, densityScale, 2)
    return Array.from({ length: count }, (_, index) => ({
        x: 20 + index * (ROAD_LENGTH / (count + 1)),
        y: 5 + seededNoise(index + 4) * 4,
        z: index % 2 === 0 ? -14 : 14,
        radius: 1.5 + seededNoise(index + 9) * 1.4,
        color: '#ffc477',
        opacity: 0.12 + seededNoise(index + 12) * 0.07,
    }))
}

function HighwayPalms({ palms }) {
    return palms.map((palm) => (
        <group key={`palm-${palm.x}-${palm.z}`} position={[palm.x, 0, palm.z]} rotation={[0, 0, palm.lean]}>
            <mesh castShadow receiveShadow position={[0, palm.height * 0.5, 0]}>
                <cylinderGeometry args={[0.16, 0.24, palm.height, 8]} />
                <meshStandardMaterial color="#6d4b2d" roughness={1} />
            </mesh>
            <mesh castShadow position={[0, palm.height + palm.crown * 0.15, 0]}>
                <sphereGeometry args={[palm.crown, 10, 10]} />
                <meshStandardMaterial color="#315c30" roughness={0.95} />
            </mesh>
        </group>
    ))
}

function Billboards({ billboards, stageId }) {
    return billboards.map((board) => (
        <group key={`board-${board.x}-${board.z}`} position={[board.x, 0, board.z]} rotation={[0, board.z > 0 ? -0.12 : 0.12, board.tilt]}>
            <mesh castShadow receiveShadow position={[0, board.poleHeight * 0.5, 0]}>
                <boxGeometry args={[0.18, board.poleHeight, 0.18]} />
                <meshStandardMaterial color={stageId === 'city' ? '#51607f' : '#85735d'} roughness={0.92} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, board.poleHeight + board.height * 0.45, 0]}>
                <boxGeometry args={[board.width, board.height, 0.22]} />
                <meshStandardMaterial
                    color={stageId === 'city' ? '#24273b' : '#e4c28c'}
                    emissive={stageId === 'city' ? '#36d1ff' : '#8c541e'}
                    emissiveIntensity={board.glow}
                    roughness={0.7}
                />
            </mesh>
        </group>
    ))
}

export default function Road({ environment }) {
    const {
        id: stageId,
        densityScale,
        road,
        props,
        atmosphere,
    } = environment

    const dashes = useMemo(() => buildRoadDashes(densityScale), [densityScale])
    const reflectorPosts = useMemo(
        () => (props.reflectorPosts ? buildReflectorPosts(densityScale) : []),
        [densityScale, props.reflectorPosts],
    )
    const guardrails = useMemo(
        () => (props.guardrails ? buildGuardrails(densityScale) : []),
        [densityScale, props.guardrails],
    )
    const palms = useMemo(
        () => (props.palmLines ? buildPalms(densityScale) : []),
        [densityScale, props.palmLines],
    )
    const billboards = useMemo(
        () => (props.billboards ? buildBillboards(densityScale, stageId) : []),
        [densityScale, props.billboards, stageId],
    )
    const barriers = useMemo(
        () => (props.barriers ? buildBarriers(densityScale) : []),
        [densityScale, props.barriers],
    )
    const buildings = useMemo(
        () => (props.buildingBands ? buildBuildings(densityScale) : []),
        [densityScale, props.buildingBands],
    )
    const cityLights = useMemo(
        () => (props.cityLights ? buildCityLights(densityScale) : []),
        [densityScale, props.cityLights],
    )
    const dunes = useMemo(
        () => (props.dunes ? buildDunes(densityScale) : []),
        [densityScale, props.dunes],
    )
    const rocks = useMemo(
        () => (props.rocks ? buildRocks(densityScale) : []),
        [densityScale, props.rocks],
    )
    const ridges = useMemo(
        () => (props.ridges ? buildRidges(densityScale, stageId) : []),
        [densityScale, props.ridges, stageId],
    )
    const cacti = useMemo(
        () => (props.cacti ? buildCacti(densityScale) : []),
        [densityScale, props.cacti],
    )
    const jungleTrees = useMemo(
        () => (props.jungleTrees ? buildJungleTrees(densityScale) : []),
        [densityScale, props.jungleTrees],
    )
    const hangingLights = useMemo(
        () => (props.hangingLights ? buildHangingLights(densityScale) : []),
        [densityScale, props.hangingLights],
    )
    const hazeBands = useMemo(
        () => buildHazeBands(atmosphere.hazeBands, densityScale, stageId),
        [atmosphere.hazeBands, densityScale, stageId],
    )
    const glowOrbs = useMemo(
        () => buildGlowOrbs(atmosphere.glowOrbs, densityScale, stageId),
        [atmosphere.glowOrbs, densityScale, stageId],
    )
    return (
        <group>
            <mesh position={[ROAD_LENGTH / 2, -0.42, 0]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH + 120, 0.56, 96]} />
                <meshStandardMaterial color={road.baseColor} roughness={1} />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, -0.08, 0]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.24, ROAD_WIDTH + 0.9]} />
                <meshStandardMaterial color={road.asphaltColor} roughness={0.9} metalness={stageId === 'city' ? 0.18 : 0.05} />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, 0.03, -ROAD_WIDTH / 2 - 0.22]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.03, 0.42]} />
                <meshStandardMaterial color={road.shoulderColor} roughness={0.95} />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, 0.03, ROAD_WIDTH / 2 + 0.22]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.03, 0.42]} />
                <meshStandardMaterial color={road.shoulderColor} roughness={0.95} />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, 0.04, -ROAD_WIDTH / 2 + 0.3]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.02, 0.16]} />
                <meshStandardMaterial color={road.shoulderLineColor} />
            </mesh>

            <mesh position={[ROAD_LENGTH / 2, 0.04, ROAD_WIDTH / 2 - 0.3]} receiveShadow>
                <boxGeometry args={[ROAD_LENGTH, 0.02, 0.16]} />
                <meshStandardMaterial color={road.shoulderLineColor} />
            </mesh>

            {dashes.map((x) => (
                <mesh key={`dash-${x}`} position={[x, 0.05, 0]} receiveShadow>
                    <boxGeometry args={[2.8, 0.02, stageId === 'city' ? 0.2 : 0.16]} />
                    <meshStandardMaterial
                        color={road.dashColor}
                        emissive={road.dashEmissive}
                        emissiveIntensity={stageId === 'city' ? 0.55 : stageId === 'night' ? 0.75 : 0.18}
                    />
                </mesh>
            ))}

            {guardrails.map((rail) => (
                <group key={`rail-${rail.x}`}>
                    {[-1, 1].map((side) => (
                        <group key={`rail-${rail.x}-${side}`} position={[rail.x, 0, side * (ROAD_WIDTH * 0.5 + 1.02)]}>
                            <mesh castShadow receiveShadow position={[0, 0.52, 0]}>
                                <boxGeometry args={[rail.length, 0.12, 0.08]} />
                                <meshStandardMaterial color="#cfc7b4" metalness={0.28} roughness={0.58} />
                            </mesh>
                            <mesh castShadow receiveShadow position={[-rail.length * 0.35, 0.3, 0]}>
                                <boxGeometry args={[0.12, 0.6, 0.12]} />
                                <meshStandardMaterial color="#8a7a66" roughness={0.92} />
                            </mesh>
                            <mesh castShadow receiveShadow position={[rail.length * 0.35, 0.3, 0]}>
                                <boxGeometry args={[0.12, 0.6, 0.12]} />
                                <meshStandardMaterial color="#8a7a66" roughness={0.92} />
                            </mesh>
                        </group>
                    ))}
                </group>
            ))}

            {reflectorPosts.map((post) => (
                <group key={`post-${post.x}-${post.z}`} position={[post.x, 0.1, post.z]}>
                    <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
                        <boxGeometry args={[0.08, 0.9, 0.08]} />
                        <meshStandardMaterial color="#f3dfbb" roughness={0.75} />
                    </mesh>
                    <mesh castShadow position={[0, 0.92, 0]}>
                        <boxGeometry args={[0.16, 0.14, 0.14]} />
                        <meshStandardMaterial color="#ff9b42" emissive="#d3641f" emissiveIntensity={post.glow} />
                    </mesh>
                </group>
            ))}

            <HighwayPalms palms={palms} />

            <Billboards billboards={billboards} stageId={stageId} />

            {barriers.map((barrier) => (
                <group key={`barrier-${barrier.x}-${barrier.z}`} position={[barrier.x, 0, barrier.z]}>
                    <mesh castShadow receiveShadow position={[0, barrier.height * 0.5, 0]}>
                        <boxGeometry args={[barrier.width, barrier.height, 0.44]} />
                        <meshStandardMaterial color="#d2d8e6" roughness={0.74} />
                    </mesh>
                    <mesh position={[0, barrier.height * 0.5 + 0.02, 0.23]}>
                        <boxGeometry args={[barrier.width * 0.92, 0.08, 0.02]} />
                        <meshStandardMaterial color="#4ad1ff" emissive="#38c8ff" emissiveIntensity={0.8} />
                    </mesh>
                </group>
            ))}

            {buildings.map((building) => {
                const color = building.hueShift > 0.6 ? '#2f3550' : building.hueShift > 0.3 ? '#252b3d' : '#1d2230'
                return (
                    <group key={`building-${building.x}-${building.z}`} position={[building.x, 0, building.z]}>
                        <mesh castShadow receiveShadow position={[0, building.height * 0.5, 0]}>
                            <boxGeometry args={[building.width, building.height, building.depth]} />
                            <meshStandardMaterial color={color} roughness={0.95} metalness={0.08} />
                        </mesh>
                        <mesh position={[0, building.height * 0.6, building.depth * 0.5 + 0.03]}>
                            <boxGeometry args={[building.width * 0.74, building.height * 0.55, 0.05]} />
                            <meshStandardMaterial color="#181d29" emissive="#4ecbff" emissiveIntensity={0.22 + building.hueShift * 0.25} />
                        </mesh>
                    </group>
                )
            })}

            {cityLights.map((light) => (
                <group key={`city-light-${light.x}-${light.z}`} position={[light.x, 0, light.z]}>
                    <mesh castShadow receiveShadow position={[0, light.height * 0.5, 0]}>
                        <cylinderGeometry args={[0.06, 0.08, light.height, 8]} />
                        <meshStandardMaterial color="#5b6680" roughness={0.82} />
                    </mesh>
                    <mesh position={[0, light.height + 0.18, 0]}>
                        <sphereGeometry args={[0.18, 10, 10]} />
                        <meshStandardMaterial color="#baf4ff" emissive="#5de0ff" emissiveIntensity={light.glow} />
                    </mesh>
                </group>
            ))}

            {jungleTrees.map((tree) => (
                <group key={`jungle-tree-${tree.x}-${tree.z}`} position={[tree.x, 0, tree.z]} rotation={[0, 0, tree.lean]}>
                    <mesh castShadow receiveShadow position={[0, tree.trunkHeight * 0.5, 0]}>
                        <cylinderGeometry args={[tree.trunkWidth * 0.7, tree.trunkWidth, tree.trunkHeight, 8]} />
                        <meshStandardMaterial color="#52341d" roughness={1} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, tree.trunkHeight + tree.crownHeight * 0.4, 0]}>
                        <sphereGeometry args={[tree.crownWidth, 14, 14]} />
                        <meshStandardMaterial color="#295f28" roughness={0.96} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0.6, tree.trunkHeight + tree.crownHeight * 0.2, 0.2]}>
                        <sphereGeometry args={[tree.crownWidth * 0.72, 12, 12]} />
                        <meshStandardMaterial color="#3f7a34" roughness={0.96} />
                    </mesh>
                </group>
            ))}

            {hangingLights.map((light) => (
                <group key={`hang-light-${light.x}-${light.z}`} position={[light.x, light.y, light.z]}>
                    <mesh position={[0, 0.55, 0]}>
                        <boxGeometry args={[0.03, 1.1, 0.03]} />
                        <meshStandardMaterial color="#352716" roughness={0.88} />
                    </mesh>
                    <mesh>
                        <sphereGeometry args={[0.18, 10, 10]} />
                        <meshStandardMaterial color="#ffe39e" emissive="#ffd065" emissiveIntensity={light.glow} />
                    </mesh>
                </group>
            ))}

            {dunes.map((dune) => (
                <mesh
                    key={`dune-${dune.x}-${dune.z}`}
                    position={[dune.x, dune.y, dune.z]}
                    scale={dune.scale}
                    castShadow
                    receiveShadow
                >
                    <sphereGeometry args={[1, 18, 18]} />
                    <meshStandardMaterial color={dune.color} roughness={1} />
                </mesh>
            ))}

            {rocks.map((rock) => (
                <mesh
                    key={`rock-${rock.x}-${rock.z}`}
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
                    key={`ridge-${ridge.x}-${ridge.z}`}
                    position={[ridge.x, ridge.y, ridge.z]}
                    castShadow
                    receiveShadow
                >
                    <coneGeometry args={[ridge.radius, ridge.height, stageId === 'highway' ? 8 : 6]} />
                    <meshStandardMaterial color={ridge.color} roughness={1} />
                </mesh>
            ))}

            {cacti.map((cactus) => (
                <group key={`cactus-${cactus.x}-${cactus.z}`} position={[cactus.x, 0, cactus.z]}>
                    <mesh castShadow receiveShadow position={[0, cactus.height * 0.5, 0]}>
                        <cylinderGeometry args={[0.18, 0.24, cactus.height, 8]} />
                        <meshStandardMaterial color="#4f7d3d" roughness={0.94} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[cactus.armOffset, cactus.armHeight, 0]} rotation={[0, 0, Math.PI / 2.8]}>
                        <cylinderGeometry args={[0.1, 0.12, cactus.height * 0.5, 8]} />
                        <meshStandardMaterial color="#4f7d3d" roughness={0.94} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[-cactus.armOffset * 0.86, cactus.armHeight * 1.05, 0]} rotation={[0, 0, -Math.PI / 3.1]}>
                        <cylinderGeometry args={[0.1, 0.12, cactus.height * 0.38, 8]} />
                        <meshStandardMaterial color="#4f7d3d" roughness={0.94} />
                    </mesh>
                </group>
            ))}

            {hazeBands.map((band) => (
                <mesh key={`haze-${band.x}-${band.z}`} position={[band.x, band.y, band.z]} rotation={[0, band.z > 0 ? -0.28 : 0.28, 0]}>
                    <planeGeometry args={[band.width, band.height]} />
                    <meshBasicMaterial color={band.color} transparent opacity={band.opacity} depthWrite={false} />
                </mesh>
            ))}

            {glowOrbs.map((orb) => (
                <mesh key={`orb-${orb.x}-${orb.z}`} position={[orb.x, orb.y, orb.z]}>
                    <sphereGeometry args={[orb.radius, 16, 16]} />
                    <meshBasicMaterial color={orb.color} transparent opacity={orb.opacity} depthWrite={false} />
                </mesh>
            ))}
        </group>
    )
}
