import { useSyncExternalStore } from 'react'
import { DEFAULT_GAMEPLAY_TUNING } from '../config/gameplayTuning'

const listeners = new Set()

let tuningState = structuredClone(DEFAULT_GAMEPLAY_TUNING)
let debugPanelOpen = false

function emitChange() {
    listeners.forEach((listener) => listener())
}

function subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

export function useGameplayTuning(selector) {
    return useSyncExternalStore(
        subscribe,
        () => (selector ? selector(tuningState) : tuningState),
        () => (selector ? selector(DEFAULT_GAMEPLAY_TUNING) : DEFAULT_GAMEPLAY_TUNING),
    )
}

export function getGameplayTuning() {
    return tuningState
}

export function setGameplayTuningState(updater) {
    if (typeof updater === 'function') {
        tuningState = updater(tuningState)
    } else {
        tuningState = mergeDeep(tuningState, updater)
    }
    emitChange()
}

export function resetGameplayTuningState() {
    tuningState = structuredClone(DEFAULT_GAMEPLAY_TUNING)
    emitChange()
}

export function useGameplayDebugPanelOpen() {
    return useSyncExternalStore(
        subscribe,
        () => debugPanelOpen,
        () => debugPanelOpen,
    )
}

export function setGameplayDebugPanelOpen(nextValue) {
    debugPanelOpen = nextValue
    emitChange()
}

function mergeDeep(target, source) {
    const output = { ...target }
    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === 'object'
        ) {
            output[key] = mergeDeep(target[key], source[key])
        } else {
            output[key] = source[key]
        }
    }
    return output
}
