import { useCallback, useEffect, useRef } from 'react'
import {
    useGameStore,
    useGameState,
    ROAD_LENGTH,
    PERFECT_WHEELIE_ANGLE,
    PERFECT_WHEELIE_WINDOW,
    INPUT_TUNING,
} from '../store/useGameStore'
import ControlPad from './game-ui/ControlPad'
import GameHUD from './game-ui/GameHUD'
import GameOverlays from './game-ui/GameOverlays'
import WheelieStreak from './game-ui/WheelieStreak'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function applyAxisResponse(value, deadZone, curve) {
    const sign = Math.sign(value)
    const magnitude = Math.abs(value)

    if (magnitude <= deadZone) return 0

    const normalized = (magnitude - deadZone) / (1 - deadZone)
    return sign * Math.pow(normalized, curve)
}

export default function GameUI() {
    const store = useGameStore()
    const speed = useGameState((s) => Math.floor(s.speed))
    const score = useGameState((s) => s.score)
    const bestScore = useGameState((s) => s.bestScore)
    const distance = useGameState((s) => s.distance)
    const wheelieDistance = useGameState((s) => Math.floor(s.wheelieDistance))
    const wheelieAngle = useGameState((s) => Math.floor(s.wheelieAngle))
    const riderWeight = useGameState((s) => s.riderWeight)
    const throttle = useGameState((s) => s.throttle)
    const brake = useGameState((s) => s.brake)
    const perfectBalance = useGameState((s) => s.perfectBalance)
    const wheelieValid = useGameState((s) => s.wheelieValid)
    const crashed = useGameState((s) => s.crashed)
    const finished = useGameState((s) => s.finished)
    const leftPointerIdRef = useRef(null)
    const rightPointerIdRef = useRef(null)
    const keyStateRef = useRef({
        weightForward: false,
        weightBack: false,
        throttle: false,
        brake: false,
    })

    const resetLeftPad = useCallback(() => {
        leftPointerIdRef.current = null
        store.setState((prev) => ({
            ...prev,
            riderWeight: 0,
        }))
    }, [store])

    const resetRightPad = useCallback(() => {
        rightPointerIdRef.current = null
        store.setState((prev) => ({
            ...prev,
            throttle: 0,
            brake: 0,
        }))
    }, [store])

    const applyLeftPadInput = useCallback((clientY, element) => {
        const rect = element.getBoundingClientRect()
        const relativeY = clamp((clientY - rect.top) / rect.height, 0, 1)
        const rawAxis = 1 - relativeY * 2
        const weightAxis = applyAxisResponse(
            rawAxis,
            INPUT_TUNING.leftPadDeadZone,
            INPUT_TUNING.riderWeightCurve,
        )

        store.setState((prev) => ({
            ...prev,
            riderWeight: weightAxis * INPUT_TUNING.riderWeightRange,
        }))
    }, [store])

    const applyRightPadInput = useCallback((clientY, element) => {
        const rect = element.getBoundingClientRect()
        const relativeY = clamp((clientY - rect.top) / rect.height, 0, 1)
        const rawAxis = 1 - relativeY * 2
        const brakeAxis = applyAxisResponse(
            Math.max(rawAxis, 0),
            INPUT_TUNING.rightPadDeadZone,
            INPUT_TUNING.brakeCurve,
        )
        const throttleAxis = applyAxisResponse(
            Math.max(-rawAxis, 0),
            INPUT_TUNING.rightPadDeadZone,
            INPUT_TUNING.throttleCurve,
        )

        const throttleValue = throttleAxis * INPUT_TUNING.throttleRange
        const brakeValue = brakeAxis * INPUT_TUNING.brakeRange

        store.setState((prev) => ({
            ...prev,
            throttle: throttleValue,
            brake: brakeValue,
        }))
    }, [store])

    const handleLeftPointerDown = useCallback((event) => {
        if (leftPointerIdRef.current !== null) return
        leftPointerIdRef.current = event.pointerId
        event.currentTarget.setPointerCapture(event.pointerId)
        applyLeftPadInput(event.clientY, event.currentTarget)
    }, [applyLeftPadInput])

    const handleLeftPointerMove = useCallback((event) => {
        if (leftPointerIdRef.current !== event.pointerId) return
        applyLeftPadInput(event.clientY, event.currentTarget)
    }, [applyLeftPadInput])

    const handleLeftPointerEnd = useCallback((event) => {
        if (leftPointerIdRef.current !== event.pointerId) return
        resetLeftPad()
    }, [resetLeftPad])

    const handleRightPointerDown = useCallback((event) => {
        if (rightPointerIdRef.current !== null) return
        rightPointerIdRef.current = event.pointerId
        event.currentTarget.setPointerCapture(event.pointerId)
        applyRightPadInput(event.clientY, event.currentTarget)
    }, [applyRightPadInput])

    const handleRightPointerMove = useCallback((event) => {
        if (rightPointerIdRef.current !== event.pointerId) return
        applyRightPadInput(event.clientY, event.currentTarget)
    }, [applyRightPadInput])

    const handleRightPointerEnd = useCallback((event) => {
        if (rightPointerIdRef.current !== event.pointerId) return
        resetRightPad()
    }, [resetRightPad])

    const syncKeyboardControls = useCallback(() => {
        const nextWeight =
            keyStateRef.current.weightForward && !keyStateRef.current.weightBack
                ? INPUT_TUNING.keyboardWeightValue
                : keyStateRef.current.weightBack && !keyStateRef.current.weightForward
                    ? -INPUT_TUNING.keyboardWeightValue
                    : 0

        const nextThrottle = keyStateRef.current.throttle ? INPUT_TUNING.keyboardThrottleValue : 0
        const nextBrake = keyStateRef.current.brake ? INPUT_TUNING.keyboardBrakeValue : 0

        store.setState((prev) => ({
            ...prev,
            riderWeight: nextWeight,
            throttle: nextThrottle,
            brake: nextBrake,
        }))
    }, [store])

    const handleRestart = useCallback(() => {
        leftPointerIdRef.current = null
        rightPointerIdRef.current = null
        keyStateRef.current = {
            weightForward: false,
            weightBack: false,
            throttle: false,
            brake: false,
        }
        store.reset()
    }, [store])

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'ArrowUp' || event.key === 'w' || event.key === ' ') {
                event.preventDefault()
                keyStateRef.current.throttle = true
                syncKeyboardControls()
            }
            if (event.key === 'ArrowDown' || event.key === 's') {
                event.preventDefault()
                keyStateRef.current.brake = true
                syncKeyboardControls()
            }
            if (event.key === 'ArrowLeft' || event.key === 'a') {
                event.preventDefault()
                keyStateRef.current.weightBack = true
                syncKeyboardControls()
            }
            if (event.key === 'ArrowRight' || event.key === 'd') {
                event.preventDefault()
                keyStateRef.current.weightForward = true
                syncKeyboardControls()
            }
            if (event.key === 'r' && (crashed || finished)) {
                handleRestart()
            }
        }

        const onKeyUp = (event) => {
            if (event.key === 'ArrowUp' || event.key === 'w' || event.key === ' ') {
                keyStateRef.current.throttle = false
                syncKeyboardControls()
            }
            if (event.key === 'ArrowDown' || event.key === 's') {
                keyStateRef.current.brake = false
                syncKeyboardControls()
            }
            if (event.key === 'ArrowLeft' || event.key === 'a') {
                keyStateRef.current.weightBack = false
                syncKeyboardControls()
            }
            if (event.key === 'ArrowRight' || event.key === 'd') {
                keyStateRef.current.weightForward = false
                syncKeyboardControls()
            }
        }

        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [crashed, finished, handleRestart, syncKeyboardControls])

    const progressPct = Math.min((distance / ROAD_LENGTH) * 100, 100)
    const angleColor = wheelieAngle > 52 ? '#ef4444' : wheelieAngle > 36 ? '#f59e0b' : '#f8fafc'
    const sweetSpotText = `${PERFECT_WHEELIE_ANGLE - PERFECT_WHEELIE_WINDOW}°-${PERFECT_WHEELIE_ANGLE + PERFECT_WHEELIE_WINDOW}°`
    const leftThumbOffset = `${50 - riderWeight * 34}%`
    const rightDriveAxis = brake - throttle
    const rightThumbOffset = `${50 - rightDriveAxis * 34}%`
    const weightReadout = riderWeight > 0.08 ? 'Forward' : riderWeight < -0.08 ? 'Back' : 'Centered'
    const driveReadout = throttle > 0.08 ? `Throttle ${Math.round(throttle * 100)}%` : brake > 0.08 ? `Brake ${Math.round(brake * 100)}%` : 'Neutral'

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between select-none">
            <GameHUD
                speed={speed}
                wheelieAngle={wheelieAngle}
                perfectBalance={perfectBalance}
                score={score}
                sweetSpotText={sweetSpotText}
                distance={distance}
                roadLength={ROAD_LENGTH}
                wheelieDistance={wheelieDistance}
                bestScore={bestScore}
                progressPct={progressPct}
                angleColor={angleColor}
            />

            {/* Wheelie streak display — centered below HUD */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '15vh',
                }}
            >
                <WheelieStreak
                    wheelieValid={wheelieValid}
                    wheelieDistance={wheelieDistance}
                    score={score}
                />
            </div>

            <div
                className="pointer-events-auto"
                style={{
                    padding: '0 0.75rem',
                    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)',
                }}
            >
                <div
                    style={{
                        maxWidth: '500px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                    }}
                >
                    <ControlPad
                        variant="weight"
                        alignClassName=""
                        mobileLabel="Weight"
                        zoneLabel="Left Zone"
                        label="Weight"
                        readout={weightReadout}
                        topLabel="Forward"
                        topValue={`${Math.round(Math.abs(riderWeight) * 100)}%`}
                        bottomLabel="Back"
                        bottomValue="Neutral"
                        thumbOffset={`calc(${leftThumbOffset} - 1.125rem)`}
                        onPointerDown={handleLeftPointerDown}
                        onPointerMove={handleLeftPointerMove}
                        onPointerUp={handleLeftPointerEnd}
                        onPointerCancel={handleLeftPointerEnd}
                        onLostPointerCapture={handleLeftPointerEnd}
                    />

                    <ControlPad
                        variant="drive"
                        alignClassName=""
                        mobileLabel="Drive"
                        zoneLabel="Right Zone"
                        label="Drive"
                        readout={driveReadout}
                        topLabel="Brake"
                        topValue={`${Math.round(brake * 100)}%`}
                        bottomLabel="Throttle"
                        bottomValue={`${Math.round(throttle * 100)}%`}
                        thumbOffset={`calc(${rightThumbOffset} - 1.125rem)`}
                        onPointerDown={handleRightPointerDown}
                        onPointerMove={handleRightPointerMove}
                        onPointerUp={handleRightPointerEnd}
                        onPointerCancel={handleRightPointerEnd}
                        onLostPointerCapture={handleRightPointerEnd}
                    />
                </div>
            </div>

            <GameOverlays
                crashed={crashed}
                finished={finished}
                speed={speed}
                distance={distance}
                score={score}
                roadLength={ROAD_LENGTH}
                onRestart={handleRestart}
            />
        </div>
    )
}
