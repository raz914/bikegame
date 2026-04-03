/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useCallback, useMemo, useSyncExternalStore } from 'react'
import { DEFAULT_GAMEPLAY_TUNING } from '../config/gameplayTuning'

// ─── Compatibility re-exports sourced from the tuning schema ──
export const WORLD_TUNING = DEFAULT_GAMEPLAY_TUNING.world
export const INPUT_TUNING = {
    leftPadDeadZone: 0.12,
    rightPadDeadZone: 0.12,
    riderWeightRange: 1,
    throttleRange: 1,
    brakeRange: 1,
    riderWeightCurve: 1.05,
    throttleCurve: 1.1,
    brakeCurve: 1.1,
    keyboardWeightValue: 0.85,
    keyboardThrottleValue: 1,
    keyboardBrakeValue: 0.92,
}
export const DRIVE_TUNING = DEFAULT_GAMEPLAY_TUNING.drive
export const PITCH_TUNING = DEFAULT_GAMEPLAY_TUNING.pitch
export const SCORE_TUNING = DEFAULT_GAMEPLAY_TUNING.scoring
export const BALANCE_TUNING = DEFAULT_GAMEPLAY_TUNING.balance

export const ROAD_LENGTH = DEFAULT_GAMEPLAY_TUNING.world.roadLength
export const ROAD_WIDTH = DEFAULT_GAMEPLAY_TUNING.world.roadWidth
export const MAX_SPEED = DEFAULT_GAMEPLAY_TUNING.drive.maxSpeed
export const ACCELERATION = DEFAULT_GAMEPLAY_TUNING.drive.acceleration
export const FRICTION = DEFAULT_GAMEPLAY_TUNING.drive.friction
export const BRAKE_STRENGTH = DEFAULT_GAMEPLAY_TUNING.drive.brakeStrength
export const WHEELIE_UP_SPEED = DEFAULT_GAMEPLAY_TUNING.pitch.liftTorque
export const WHEELIE_DOWN_SPEED = DEFAULT_GAMEPLAY_TUNING.pitch.settleTorque
export const GRAVITY_DROP_SPEED = DEFAULT_GAMEPLAY_TUNING.pitch.gravityTorque
export const MAX_WHEELIE_ANGLE = DEFAULT_GAMEPLAY_TUNING.pitch.maxAngle
export const MAX_STOPPIE_ANGLE = DEFAULT_GAMEPLAY_TUNING.pitch.forwardMaxAngle
export const VALID_WHEELIE_MIN_ANGLE = DEFAULT_GAMEPLAY_TUNING.pitch.validMinAngle
export const WHEELIE_SCORE_MULTIPLIER = DEFAULT_GAMEPLAY_TUNING.scoring.perfectMultiplier
export const PERFECT_WHEELIE_ANGLE = DEFAULT_GAMEPLAY_TUNING.scoring.perfectAngle
export const PERFECT_WHEELIE_WINDOW = DEFAULT_GAMEPLAY_TUNING.scoring.perfectWindow
export const BALANCE_DRIFT_BASE = DEFAULT_GAMEPLAY_TUNING.balance.driftBase
export const BALANCE_DRIFT_SPEED_FACTOR = DEFAULT_GAMEPLAY_TUNING.balance.driftSpeedFactor
export const ARCADE_TUNING = DEFAULT_GAMEPLAY_TUNING.arcade

const initialState = (persisted = {}) => ({
    speed: 0,
    finishSpeed: 0,
    wheelieAngle: 0,
    pitchVelocity: 0,
    position: 0,
    distance: 0,
    wheelieDistance: 0,
    currentWheelieDistance: 0,
    wheelieTime: 0,
    rawCurrentWheelieScore: 0,
    currentWheelieScore: 0,
    rawScore: 0,
    score: 0,
    bestScore: persisted.bestScore ?? 0,
    riderWeight: 0,
    throttle: 0,
    brake: 0,
    paused: false,
    balanceMode: 'grounded',
    wheelieValid: false,
    stoppieValid: false,
    perfectBalance: false,
    crashed: false,
    crashKind: null,
    finished: false,
    // Arcade-specific
    laneIndex: 1,
    laneOffsetZ: 0,
    arcadeCoins: 0,
    collectedCoinIds: new Set(),
})

// ─── Store Context ────────────────────────────────────
const GameStoreContext = createContext(null)

export function GameStoreProvider({ children }) {
    const stateRef = useRef(initialState())
    const listenersRef = useRef(new Set())

    const getState = useCallback(() => stateRef.current, [])

    const setState = useCallback((updater) => {
        const prev = stateRef.current
        const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
        stateRef.current = next
        listenersRef.current.forEach((fn) => fn(next))
    }, [])

    const subscribe = useCallback((fn) => {
        listenersRef.current.add(fn)
        return () => listenersRef.current.delete(fn)
    }, [])

    const reset = useCallback(() => {
        stateRef.current = initialState({ bestScore: stateRef.current.bestScore })
        listenersRef.current.forEach((fn) => fn(stateRef.current))
    }, [])

    const store = useMemo(
        () => ({ getState, setState, subscribe, reset }),
        [getState, setState, subscribe, reset],
    )

    return (
        <GameStoreContext.Provider value={store}>
            {children}
        </GameStoreContext.Provider>
    )
}

export function useGameStore() {
    const store = useContext(GameStoreContext)
    if (!store) throw new Error('useGameStore must be used within GameStoreProvider')
    return store
}

export function useGameState(selector) {
    const store = useGameStore()
    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.getState()),
    )
}
