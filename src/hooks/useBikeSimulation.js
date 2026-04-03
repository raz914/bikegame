import { useFrame } from '@react-three/fiber'
import { getGameplayTuning } from '../store/useGameplayTuningStore'
import { useUIState, GAME_MODES } from '../store/useUIStore'
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
    arcadeSpawns,
}) {
    const gameMode = useUIState((s) => s.selectedGameMode)
    const isArcade = gameMode === GAME_MODES.ARCADE

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
            riderWeight: isArcade ? 0 : state.riderWeight,
        }

        const result = stepWheelieSimulation(simState, inputs, tuning, dt)

        // Arcade-specific: lane interpolation, coin collection, obstacle collision
        let arcadeUpdates = null
        if (isArcade) {
            arcadeUpdates = processArcadeFrame(state, result, tuning, dt, arcadeSpawns)
        }

        if (result.crashed) {
            const arcadeCrashState = arcadeUpdates
                ? {
                    laneOffsetZ: arcadeUpdates.laneOffsetZ,
                    arcadeCoins: arcadeUpdates.arcadeCoins,
                    collectedCoinIds: arcadeUpdates.collectedCoinIds,
                    score: arcadeUpdates.score,
                    position: result.position,
                    distance: Math.floor(result.position),
                    speed: result.speed,
                }
                : {}
            store.setState({
                crashed: true,
                wheelieAngle: result.pitchAngle,
                pitchVelocity: 0,
                balanceMode: result.balanceMode,
                wheelieValid: false,
                stoppieValid: false,
                perfectBalance: false,
                crashKind: result.crashKind,
                bestScore: Math.max(
                    state.bestScore,
                    arcadeUpdates ? arcadeUpdates.score : Math.floor(result.rawScore),
                ),
                ...arcadeCrashState,
            })
            return
        }

        // Arcade obstacle crash takes priority after physics crash check
        if (arcadeUpdates?.crashed) {
            store.setState({
                crashed: true,
                crashKind: 'obstacle',
                wheelieAngle: result.pitchAngle,
                pitchVelocity: result.pitchVelocity,
                position: result.position,
                speed: result.speed,
                distance: Math.floor(result.position),
                balanceMode: result.balanceMode,
                wheelieValid: false,
                stoppieValid: false,
                perfectBalance: false,
                score: arcadeUpdates.score,
                bestScore: Math.max(state.bestScore, arcadeUpdates.score),
                laneOffsetZ: arcadeUpdates.laneOffsetZ,
                arcadeCoins: arcadeUpdates.arcadeCoins,
                collectedCoinIds: arcadeUpdates.collectedCoinIds,
            })
            return
        }

        if (result.finished) {
            const finishScore = arcadeUpdates ? arcadeUpdates.score : Math.floor(result.rawScore)
            store.setState({
                finished: true,
                position: result.position,
                speed: result.speed,
                finishSpeed: result.finishSpeed,
                pitchVelocity: 0,
                balanceMode: 'grounded',
                wheelieValid: false,
                stoppieValid: false,
                perfectBalance: false,
                crashKind: null,
                score: finishScore,
                bestScore: Math.max(state.bestScore, finishScore),
                ...(arcadeUpdates ? {
                    laneOffsetZ: arcadeUpdates.laneOffsetZ,
                    arcadeCoins: arcadeUpdates.arcadeCoins,
                    collectedCoinIds: arcadeUpdates.collectedCoinIds,
                } : {}),
            })
            return
        }

        const wheelieScore = Math.floor(result.rawScore)
        const currentWheelieScore = Math.floor(result.rawCurrentWheelieScore)
        const totalScore = arcadeUpdates
            ? wheelieScore + arcadeUpdates.arcadeCoins * tuning.arcade.coinValue
            : wheelieScore

        store.setState({
            speed: result.speed,
            wheelieAngle: result.pitchAngle,
            pitchVelocity: result.pitchVelocity,
            position: result.position,
            rawScore: result.rawScore,
            score: totalScore,
            bestScore: Math.max(state.bestScore, totalScore),
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
            ...(arcadeUpdates ? {
                laneOffsetZ: arcadeUpdates.laneOffsetZ,
                arcadeCoins: arcadeUpdates.arcadeCoins,
                collectedCoinIds: arcadeUpdates.collectedCoinIds,
            } : {}),
        })

        // ── Visual transforms ──────────────────────────────
        const speedRatio = tuning.drive.maxSpeed > 0 ? result.speed / tuning.drive.maxSpeed : 0

        if (bikeGroupRef.current) {
            bikeGroupRef.current.position.x = result.position
            bikeGroupRef.current.position.y =
                Math.sin(result.position * tuning.visuals.bobFrequency) * tuning.visuals.bobAmplitude * speedRatio
            if (arcadeUpdates) {
                bikeGroupRef.current.position.z = arcadeUpdates.laneOffsetZ
            }
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

function processArcadeFrame(state, physicsResult, tuning, dt, arcadeSpawns) {
    const { arcade } = tuning

    // Lane interpolation
    const centerLane = Math.floor(arcade.laneCount / 2)
    const targetZ = (state.laneIndex - centerLane) * arcade.laneWidth
    const laneOffsetZ = state.laneOffsetZ + (targetZ - state.laneOffsetZ) * Math.min(1, arcade.laneSwitchSpeed * dt)

    // Coin collection
    let arcadeCoins = state.arcadeCoins
    let collectedCoinIds = state.collectedCoinIds
    const coinsEnabled = physicsResult.balanceMode !== 'grounded'
    const pickupWindow = Math.max(arcade.coinPickupRadius + physicsResult.positionDelta + 0.4, arcade.coinPickupRadius + 0.75)
    if (arcadeSpawns && coinsEnabled) {
        for (const coin of arcadeSpawns.coins) {
            if (Math.abs(coin.x - physicsResult.position) > pickupWindow) continue
            if (collectedCoinIds.has(coin.id)) continue
            if (Math.abs(coin.x - physicsResult.position) < arcade.coinPickupRadius && coin.lane === state.laneIndex) {
                if (collectedCoinIds === state.collectedCoinIds) {
                    collectedCoinIds = new Set(state.collectedCoinIds)
                }
                collectedCoinIds.add(coin.id)
                arcadeCoins += 1
            }
        }
    }

    // Obstacle collision
    let crashed = false
    if (arcadeSpawns) {
        for (const obs of arcadeSpawns.obstacles) {
            if (Math.abs(obs.x - physicsResult.position) < arcade.obstacleHitRadius && obs.lane === state.laneIndex) {
                crashed = true
                break
            }
        }
    }

    const score = Math.floor(physicsResult.rawScore) + arcadeCoins * arcade.coinValue

    return { laneOffsetZ, arcadeCoins, collectedCoinIds, crashed, score }
}
