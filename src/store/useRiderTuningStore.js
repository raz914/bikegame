import { useSyncExternalStore } from 'react'

export const DEFAULT_RIDER_TUNING = {
    "scale": 1.2,
    "yaw": 1.59840734641021,
    "seatXRatio": 0.36,
    "seatYRatio": 0.16,
    "seatYOffset": 0.03,
    "seatZOffset": 0,
    "hipsOffsetY": 16,
    "hipsOffsetZ": -4,
    "hipsPitch": 0.17,
    "spinePitch": 0,
    "spine1Pitch": 0.24,
    "spine2Pitch": 0.21,
    "neckPitch": -0.08,
    "headPitch": -0.04,
    "headYaw": 0.05,
    "shoulderPitch": 0.19,
    "shoulderYaw": 0.16,
    "shoulderRoll": 0.6,
    "armPitch": 0.17,
    "armYaw": -0.02,
    "armRoll": -0.45,
    "foreArmPitch": -0.85,
    "foreArmYaw": 0.03,
    "foreArmRoll": 0.54,
    "handPitch": 0.13,
    "handYaw": 0.12,
    "handRoll": 0.26,
    "upLegPitch": -0.69,
    "upLegYaw": 0,
    "upLegRoll": 0.22,
    "legPitch": -0.66,
    "footPitch": -0.5,
    "footYaw": 0.15,
    "footRoll": -0.31,
    "toePitch": 0.18
  }

const listeners = new Set()

let riderTuningState = { ...DEFAULT_RIDER_TUNING }
let riderDebugPanelOpen = true

function emitChange() {
    listeners.forEach((listener) => listener())
}

function subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

export function useRiderTuning(selector = (state) => state) {
    return useSyncExternalStore(
        subscribe,
        () => selector(riderTuningState),
        () => selector(DEFAULT_RIDER_TUNING),
    )
}

export function setRiderTuningState(updater) {
    riderTuningState = typeof updater === 'function'
        ? updater(riderTuningState)
        : { ...riderTuningState, ...updater }

    emitChange()
}

export function resetRiderTuningState() {
    riderTuningState = { ...DEFAULT_RIDER_TUNING }
    emitChange()
}

export function useRiderDebugPanelOpen() {
    return useSyncExternalStore(
        subscribe,
        () => riderDebugPanelOpen,
        () => riderDebugPanelOpen,
    )
}

export function setRiderDebugPanelOpen(nextValue) {
    riderDebugPanelOpen = nextValue
    emitChange()
}
