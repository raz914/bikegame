import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
    useGameStore,
    ROAD_LENGTH,
    MAX_SPEED,
    ACCELERATION,
    FRICTION,
    BRAKE_STRENGTH,
    WHEELIE_UP_SPEED,
    WHEELIE_DOWN_SPEED,
    GRAVITY_DROP_SPEED,
    MAX_WHEELIE_ANGLE,
    VALID_WHEELIE_MIN_ANGLE,
    WHEELIE_SCORE_MULTIPLIER,
    PERFECT_WHEELIE_ANGLE,
    PERFECT_WHEELIE_WINDOW,
    BALANCE_DRIFT_BASE,
    BALANCE_DRIFT_SPEED_FACTOR,
} from '../store/useGameStore'

const DEG2RAD = Math.PI / 180
const clamp01 = (value) => Math.max(0, Math.min(1, value))

function Wheel({ wheelRef, radius }) {
    const spokes = useMemo(() => (
        Array.from({ length: 6 }, (_, index) => index * (Math.PI / 6))
    ), [])

    return (
        <group ref={wheelRef}>
            <mesh castShadow receiveShadow>
                <torusGeometry args={[radius, 0.085, 14, 32]} />
                <meshStandardMaterial color="#181818" roughness={0.7} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[radius * 0.68, radius * 0.68, 0.08, 24]} />
                <meshStandardMaterial color="#b7b7b7" metalness={0.9} roughness={0.25} />
            </mesh>
            {spokes.map((angle) => (
                <mesh key={angle} rotation={[0, 0, angle]}>
                    <boxGeometry args={[radius * 1.2, 0.025, 0.025]} />
                    <meshStandardMaterial color="#515151" metalness={0.5} roughness={0.4} />
                </mesh>
            ))}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.16, 12]} />
                <meshStandardMaterial color="#6a6a6a" metalness={0.7} roughness={0.35} />
            </mesh>
        </group>
    )
}

export default function Bike() {
    const bikeGroupRef = useRef()
    const pivotRef = useRef()
    const frontWheelRef = useRef()
    const rearWheelRef = useRef()
    const store = useGameStore()

    useFrame((_, delta) => {
        const state = store.getState()
        if (state.crashed || state.finished) return

        const dt = Math.min(delta, 0.05)

        let {
            speed,
            wheelieAngle,
            position,
            score,
            wheelieTime,
            wheelieDistance,
            bestScore,
        } = state
        const throttle = clamp01(state.throttle)
        const brake = clamp01(state.brake)
        const riderWeight = Math.max(-1, Math.min(1, state.riderWeight))
        const speedRatio = speed / MAX_SPEED
        const driftWave = Math.sin(position * 0.65) + Math.sin(position * 2.4) * 0.45
        const roadKick = Math.max(0, Math.sin(position * 3.6)) * speedRatio

        if (speed > 1.5 && wheelieAngle > 0) {
            const driftForce = (BALANCE_DRIFT_BASE + speedRatio * BALANCE_DRIFT_SPEED_FACTOR) * dt
            wheelieAngle += driftWave * driftForce * 0.24
            wheelieAngle += roadKick * driftForce * 0.45
        }

        const backwardWeight = Math.max(-riderWeight, 0)
        const forwardWeight = Math.max(riderWeight, 0)
        const liftControl = throttle * (0.82 + backwardWeight * 0.78)
        const settleControl = brake * 0.78 + forwardWeight * 0.92

        if (liftControl > 0.001) {
            const liftSpeed = WHEELIE_UP_SPEED * liftControl + speedRatio * 12 * throttle + backwardWeight * 10
            wheelieAngle = Math.min(wheelieAngle + liftSpeed * dt, 90)
        } else if (settleControl > 0.001) {
            const settleSpeed = WHEELIE_DOWN_SPEED * (0.42 + settleControl * 0.58)
            wheelieAngle = Math.max(wheelieAngle - settleSpeed * dt, 0)
        } else {
            wheelieAngle = Math.max(wheelieAngle - (GRAVITY_DROP_SPEED + speedRatio * 8) * dt, 0)
        }

        if (wheelieAngle > MAX_WHEELIE_ANGLE) {
            store.setState({
                crashed: true,
                wheelieAngle: MAX_WHEELIE_ANGLE,
                wheelieValid: false,
                perfectBalance: false,
                bestScore: Math.max(bestScore, Math.floor(score)),
            })
            return
        }

        const accelerationForce = ACCELERATION * throttle
        const brakeForce = BRAKE_STRENGTH * brake
        const coastingDrag = FRICTION * (throttle > 0 ? 0.35 : 1)
        speed = Math.min(speed + accelerationForce * dt, MAX_SPEED)
        speed = Math.max(speed - coastingDrag * dt - brakeForce * dt, 0)

        if (wheelieAngle > PERFECT_WHEELIE_ANGLE + PERFECT_WHEELIE_WINDOW + 8) {
            speed = Math.max(speed - 7 * dt, 0)
        }

        const positionDelta = speed * dt
        position += speed * dt

        if (position >= ROAD_LENGTH) {
            store.setState({
                finished: true,
                position: ROAD_LENGTH,
                speed: 0,
                wheelieValid: false,
                perfectBalance: false,
                bestScore: Math.max(bestScore, Math.floor(score)),
            })
            return
        }

        const perfectBalance = Math.abs(wheelieAngle - PERFECT_WHEELIE_ANGLE) <= PERFECT_WHEELIE_WINDOW
        const wheelieValid = speed > 2 && wheelieAngle >= VALID_WHEELIE_MIN_ANGLE && wheelieAngle < MAX_WHEELIE_ANGLE - 4
        let points = speed * dt * 0.5

        if (wheelieValid) {
            wheelieTime += dt
            wheelieDistance += positionDelta
            points = speed * dt * (1 + wheelieAngle / 38)
            if (perfectBalance) {
                points *= WHEELIE_SCORE_MULTIPLIER
            }
        }

        score += points
        bestScore = Math.max(bestScore, Math.floor(score))

        store.setState({
            speed,
            wheelieAngle,
            position,
            score: Math.floor(score),
            bestScore,
            wheelieTime,
            wheelieDistance,
            distance: Math.floor(position),
            wheelieValid,
            perfectBalance,
            debug: {
                riderWeight,
                throttle,
                brake,
                speed: Math.floor(speed),
                pitchAngle: Math.floor(wheelieAngle),
                wheelieValid,
            },
        })

        if (bikeGroupRef.current) {
            bikeGroupRef.current.position.x = position
            bikeGroupRef.current.position.y = Math.sin(position * 8) * 0.02 * speedRatio
        }

        if (pivotRef.current) {
            pivotRef.current.rotation.z = wheelieAngle * DEG2RAD
        }

        const wheelSpin = speed * dt * 3.2
        if (rearWheelRef.current) rearWheelRef.current.rotation.z -= wheelSpin
        if (frontWheelRef.current) frontWheelRef.current.rotation.z -= wheelSpin
    })

    return (
        <group ref={bikeGroupRef} position={[0, 0, 0]}>
            <group ref={pivotRef} position={[0, 0, 0]}>
                <group position={[0, 0.42, 0]}>
                    <Wheel wheelRef={rearWheelRef} radius={0.38} />
                </group>

                <mesh position={[0.55, 0.6, 0]} rotation={[0, 0, 0.08]} castShadow>
                    <boxGeometry args={[1.25, 0.1, 0.16]} />
                    <meshStandardMaterial color="#a11313" metalness={0.45} roughness={0.35} />
                </mesh>

                <mesh position={[0.48, 0.86, 0]} rotation={[0, 0, 0.15]} castShadow>
                    <boxGeometry args={[0.72, 0.16, 0.3]} />
                    <meshStandardMaterial color="#d73322" metalness={0.55} roughness={0.32} />
                </mesh>

                <mesh position={[0.05, 0.94, 0]} castShadow>
                    <boxGeometry args={[0.55, 0.1, 0.3]} />
                    <meshStandardMaterial color="#1f1f1f" roughness={0.8} />
                </mesh>

                <mesh position={[0.55, 0.56, 0]} castShadow>
                    <boxGeometry args={[0.38, 0.3, 0.34]} />
                    <meshStandardMaterial color="#525252" metalness={0.65} roughness={0.3} />
                </mesh>

                <mesh position={[1.08, 0.74, 0]} rotation={[0, 0, 0.56]} castShadow>
                    <boxGeometry args={[0.08, 1, 0.12]} />
                    <meshStandardMaterial color="#aeb4b9" metalness={0.7} roughness={0.25} />
                </mesh>

                <mesh position={[0.86, 0.55, 0]} rotation={[0, 0, -0.18]} castShadow>
                    <boxGeometry args={[0.74, 0.07, 0.08]} />
                    <meshStandardMaterial color="#3b3b3b" metalness={0.45} roughness={0.4} />
                </mesh>

                <mesh position={[1.18, 1.14, 0]} rotation={[0, 0, 0.1]} castShadow>
                    <boxGeometry args={[0.2, 0.08, 0.62]} />
                    <meshStandardMaterial color="#2b2b2b" metalness={0.4} roughness={0.42} />
                </mesh>

                <mesh position={[0.05, 0.5, 0.18]} rotation={[0, 0, -0.55]} castShadow>
                    <cylinderGeometry args={[0.035, 0.05, 0.9, 10]} />
                    <meshStandardMaterial color="#8b8b8b" metalness={0.9} roughness={0.2} />
                </mesh>

                <group position={[1.4, 0.42, 0]}>
                    <Wheel wheelRef={frontWheelRef} radius={0.35} />
                </group>

                <mesh position={[1.54, 0.9, 0.12]} castShadow>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#fff4c2" emissive="#ffe287" emissiveIntensity={0.9} />
                </mesh>

                <mesh position={[-0.24, 0.88, 0]}>
                    <boxGeometry args={[0.08, 0.08, 0.22]} />
                    <meshStandardMaterial color="#ff3f33" emissive="#d91919" emissiveIntensity={0.75} />
                </mesh>

                <group position={[0.52, 1.28, 0]}>
                    <mesh position={[0, 0.34, 0]} castShadow>
                        <sphereGeometry args={[0.16, 16, 16]} />
                        <meshStandardMaterial color="#161616" roughness={0.9} />
                    </mesh>
                    <mesh position={[0.02, 0.02, 0]} rotation={[0, 0, -0.18]} castShadow>
                        <capsuleGeometry args={[0.12, 0.45, 8, 12]} />
                        <meshStandardMaterial color="#273649" roughness={0.82} />
                    </mesh>
                    <mesh position={[0.12, -0.35, 0]} rotation={[0, 0, -0.2]} castShadow>
                        <capsuleGeometry args={[0.08, 0.42, 6, 10]} />
                        <meshStandardMaterial color="#1d1d1d" roughness={0.85} />
                    </mesh>
                    <mesh position={[-0.18, -0.28, 0]} rotation={[0, 0, 0.5]} castShadow>
                        <capsuleGeometry args={[0.06, 0.34, 6, 10]} />
                        <meshStandardMaterial color="#273649" roughness={0.82} />
                    </mesh>
                </group>
            </group>
        </group>
    )
}
