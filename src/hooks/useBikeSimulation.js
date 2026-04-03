import { useFrame } from '@react-three/fiber'
import { getGameplayTuning } from '../store/useGameplayTuningStore'
import stepWheelieSimulation from '../utils/stepWheelieSimulation'

const DEG2RAD = Math.PI / 180

export default function useBikeSimulation({
    store,
    bikeGroupRef,
    pivotRef,
    modelRootRef,
    rearWheelRef,
    frontWheelRef,
    gameplayBike,
}) {
    useFrame((_, delta) => {
        const state = store.getState()
        if (state.crashed || state.finished || state.paused) return

        const dt = Math.min(delta, 0.05)
        const tuning = getGameplayTuning()

        const simState = {
            pitchAngle: state.wheelieAngle,
            pitchVelocity: state.pitchVelocity,
            speed: state.speed,
            position: state.position,
            rawScore: state.rawScore,
            wheelieTime: state.wheelieTime,
            wheelieDistance: state.wheelieDistance,
            currentWheelieDistance: state.currentWheelieDistance,
            rawCurrentWheelieScore: state.rawCurrentWheelieScore,
        }

        const inputs = {
            throttle: state.throttle,
            brake: state.brake,
            riderWeight: state.riderWeight,
        }

        const result = stepWheelieSimulation(simState, inputs, tuning, dt)

        if (result.crashed) {
            store.setState({
                crashed: true,
                wheelieAngle: result.pitchAngle,
                pitchVelocity: 0,
                balanceMode: result.balanceMode,
                wheelieValid: false,
                stoppieValid: false,
                perfectBalance: false,
                crashKind: result.crashKind,
                bestScore: Math.max(state.bestScore, Math.floor(result.rawScore)),
            })
            return
        }

        if (result.finished) {
            store.setState({
                finished: true,
                position: result.position,
                speed: 0,
                pitchVelocity: 0,
                balanceMode: 'grounded',
                wheelieValid: false,
                stoppieValid: false,
                perfectBalance: false,
                crashKind: null,
                bestScore: Math.max(state.bestScore, Math.floor(result.rawScore)),
            })
            return
        }

        const score = Math.floor(result.rawScore)
        const currentWheelieScore = Math.floor(result.rawCurrentWheelieScore)

        store.setState({
            speed: result.speed,
            wheelieAngle: result.pitchAngle,
            pitchVelocity: result.pitchVelocity,
            position: result.position,
            rawScore: result.rawScore,
            score,
            bestScore: Math.max(state.bestScore, score),
            wheelieTime: result.wheelieTime,
            wheelieDistance: result.wheelieDistance,
            currentWheelieDistance: result.currentWheelieDistance,
            rawCurrentWheelieScore: result.rawCurrentWheelieScore,
            currentWheelieScore,
            distance: Math.floor(result.position),
            balanceMode: result.balanceMode,
            wheelieValid: result.wheelieValid,
            stoppieValid: result.stoppieValid,
            perfectBalance: result.perfectBalance,
            crashKind: null,
        })

        // ── Visual transforms ──────────────────────────────
        const speedRatio = tuning.drive.maxSpeed > 0 ? result.speed / tuning.drive.maxSpeed : 0

        if (bikeGroupRef.current) {
            bikeGroupRef.current.position.x = result.position
            bikeGroupRef.current.position.y =
                Math.sin(result.position * tuning.visuals.bobFrequency) * tuning.visuals.bobAmplitude * speedRatio
        }

        if (pivotRef.current) {
            const pivotPoint = result.pitchAngle < 0
                ? gameplayBike?.frontContactPoint ?? [0, 0, 0]
                : gameplayBike?.rearContactPoint ?? [0, 0, 0]
            pivotRef.current.position.set(pivotPoint[0], pivotPoint[1], pivotPoint[2])
            pivotRef.current.rotation.z = result.pitchAngle * DEG2RAD
        }

        if (modelRootRef.current) {
            const pivotPoint = result.pitchAngle < 0
                ? gameplayBike?.frontContactPoint ?? [0, 0, 0]
                : gameplayBike?.rearContactPoint ?? [0, 0, 0]
            modelRootRef.current.position.set(-pivotPoint[0], -pivotPoint[1], -pivotPoint[2])
        }

        const wheelSpin = result.speed * dt * tuning.visuals.wheelSpinRate
        if (rearWheelRef.current) rearWheelRef.current.rotation.y += wheelSpin
        if (frontWheelRef.current) frontWheelRef.current.rotation.y += wheelSpin
    })
}
