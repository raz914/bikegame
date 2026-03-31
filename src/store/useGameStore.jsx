/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useCallback, useMemo, useSyncExternalStore } from 'react'

// ─── Game Constants ───────────────────────────────────
export const WORLD_TUNING = {
    roadLength: 300,
    roadWidth: 8,
}

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

export const DRIVE_TUNING = {
    maxSpeed: 30,
    acceleration: 11,
    friction: 4.5,
    brakeStrength: 8,
}

export const PITCH_TUNING = {
    liftSpeed: 58,
    settleSpeed: 88,
    gravityDropSpeed: 30,
    maxWheelieAngle: 60,
    validWheelieMinAngle: 8,
}

export const SCORE_TUNING = {
    wheelieScoreMultiplier: 2.4,
    perfectWheelieAngle: 31,
    perfectWheelieWindow: 6,
}

export const BALANCE_TUNING = {
    driftBase: 10,
    driftSpeedFactor: 16,
}

// Compatibility exports for the current alpha scene.
export const ROAD_LENGTH = WORLD_TUNING.roadLength
export const ROAD_WIDTH = WORLD_TUNING.roadWidth
export const MAX_SPEED = DRIVE_TUNING.maxSpeed
export const ACCELERATION = DRIVE_TUNING.acceleration
export const FRICTION = DRIVE_TUNING.friction
export const WHEELIE_UP_SPEED = PITCH_TUNING.liftSpeed
export const WHEELIE_DOWN_SPEED = PITCH_TUNING.settleSpeed
export const GRAVITY_DROP_SPEED = PITCH_TUNING.gravityDropSpeed
export const MAX_WHEELIE_ANGLE = PITCH_TUNING.maxWheelieAngle
export const VALID_WHEELIE_MIN_ANGLE = PITCH_TUNING.validWheelieMinAngle
export const WHEELIE_SCORE_MULTIPLIER = SCORE_TUNING.wheelieScoreMultiplier
export const PERFECT_WHEELIE_ANGLE = SCORE_TUNING.perfectWheelieAngle
export const PERFECT_WHEELIE_WINDOW = SCORE_TUNING.perfectWheelieWindow
export const BALANCE_DRIFT_BASE = BALANCE_TUNING.driftBase
export const BALANCE_DRIFT_SPEED_FACTOR = BALANCE_TUNING.driftSpeedFactor
export const BRAKE_STRENGTH = DRIVE_TUNING.brakeStrength

const initialState = (persisted = {}) => ({
    speed: 0,
    wheelieAngle: 0,       // degrees: 0 = flat, 90 = vertical
    position: 0,           // X along road
    distance: 0,           // road progress
    wheelieDistance: 0,    // distance while wheelie state is valid
    wheelieTime: 0,        // seconds spent in wheelie
    score: 0,
    bestScore: persisted.bestScore ?? 0,
    riderWeight: 0,        // -1 = back, 1 = forward
    throttle: 0,           // 0..1
    brake: 0,              // 0..1
    wheelieValid: false,
    perfectBalance: false,
    crashed: false,
    finished: false,
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
