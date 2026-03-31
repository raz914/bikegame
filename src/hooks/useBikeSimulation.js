import { useFrame } from '@react-three/fiber'
import {
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

export default function useBikeSimulation({
    store,
    bikeGroupRef,
    pivotRef,
    rearWheelRef,
    frontWheelRef,
}) {
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
        const angleRecoveryFactor = Math.min(wheelieAngle / MAX_WHEELIE_ANGLE, 1)

        if (liftControl > 0.001) {
            const liftSpeed = WHEELIE_UP_SPEED * liftControl + speedRatio * 12 * throttle + backwardWeight * 10
            wheelieAngle = Math.min(wheelieAngle + liftSpeed * dt, 90)
        } else if (settleControl > 0.001) {
            const settleSpeed = WHEELIE_DOWN_SPEED * (0.5 + settleControl * 0.7 + angleRecoveryFactor * 0.45)
            wheelieAngle = Math.max(wheelieAngle - settleSpeed * dt, 0)
        } else {
            const passiveDropSpeed = GRAVITY_DROP_SPEED + speedRatio * 8 + angleRecoveryFactor * 18
            wheelieAngle = Math.max(wheelieAngle - passiveDropSpeed * dt, 0)
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
        })

        if (bikeGroupRef.current) {
            bikeGroupRef.current.position.x = position
            bikeGroupRef.current.position.y = Math.sin(position * 8) * 0.02 * speedRatio
        }

        if (pivotRef.current) {
            pivotRef.current.rotation.z = wheelieAngle * DEG2RAD
        }

        const wheelSpin = speed * dt * 3.2
        if (rearWheelRef.current) rearWheelRef.current.rotation.y += wheelSpin
        if (frontWheelRef.current) frontWheelRef.current.rotation.y += wheelSpin
    })
}
