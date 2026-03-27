import { useCallback, useEffect, useRef } from 'react'
import {
    useGameStore,
    useGameState,
    ROAD_LENGTH,
    PERFECT_WHEELIE_ANGLE,
    PERFECT_WHEELIE_WINDOW,
    INPUT_TUNING,
} from '../store/useGameStore'

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
            <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="min-w-[132px] rounded-[1.35rem] border border-white/12 bg-black/40 px-4 py-3 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Speed</div>
                    <div className="mt-1 text-3xl font-black tabular-nums leading-none">
                        {speed}
                        <span className="ml-1 text-sm font-medium text-white/45">km/h</span>
                    </div>
                    <div className="mt-3 text-[10px] uppercase tracking-[0.28em] text-white/45">Balance</div>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="text-xl font-bold tabular-nums" style={{ color: angleColor }}>
                            {wheelieAngle}°
                        </span>
                        {perfectBalance && (
                            <span className="rounded-full border border-amber-300/40 bg-amber-300/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                                Sweet
                            </span>
                        )}
                    </div>
                </div>

                <div className="min-w-[142px] rounded-[1.35rem] border border-white/12 bg-black/40 px-4 py-3 text-right text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Score</div>
                    <div className="mt-1 text-3xl font-black tabular-nums leading-none">{score.toLocaleString()}</div>
                    <div className="mt-3 text-[10px] uppercase tracking-[0.28em] text-white/45">Sweet Spot</div>
                    <div className="mt-1 text-sm font-semibold text-amber-100">{sweetSpotText}</div>
                    <div className="mt-2 text-xs text-white/45">{distance}m / {ROAD_LENGTH}m</div>
                    <div className="mt-1 text-xs text-white/45">Wheelie {wheelieDistance}m · Best {bestScore.toLocaleString()}</div>
                </div>
            </div>

            <div className="pointer-events-auto px-3 pb-4 sm:px-5 sm:pb-6">
                <div className="mx-auto grid max-w-xl grid-cols-[minmax(140px,1fr)_108px_minmax(140px,1fr)] items-end gap-3 sm:grid-cols-[minmax(180px,1fr)_128px_minmax(180px,1fr)] sm:gap-4">
                    <div
                        className="relative h-40 rounded-[2rem] border border-sky-300/30 bg-sky-500/18 px-4 py-4 text-white shadow-[0_18px_40px_rgba(14,116,144,0.22)] backdrop-blur-md sm:h-48"
                        onPointerDown={handleLeftPointerDown}
                        onPointerMove={handleLeftPointerMove}
                        onPointerUp={handleLeftPointerEnd}
                        onPointerCancel={handleLeftPointerEnd}
                        onLostPointerCapture={handleLeftPointerEnd}
                        onContextMenu={(event) => event.preventDefault()}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.28em] text-white/50">Left Zone</div>
                                <div className="mt-1 text-sm font-black uppercase tracking-[0.2em]">Weight</div>
                            </div>
                            <div className="rounded-full border border-white/12 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                                {weightReadout}
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-x-4 bottom-4 top-16 rounded-[1.6rem] border border-white/10 bg-black/18">
                            <div className="absolute inset-x-5 top-4 flex justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                <span>Forward</span>
                                <span>{Math.round(Math.abs(riderWeight) * 100)}%</span>
                            </div>
                            <div className="absolute bottom-4 inset-x-5 flex justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                <span>Back</span>
                                <span>Neutral</span>
                            </div>
                            <div className="absolute bottom-1/2 left-5 right-5 h-px bg-white/16" />
                            <div className="absolute bottom-4 top-4 left-1/2 w-px -translate-x-1/2 bg-white/8" />
                            <div
                                className="absolute left-1/2 h-14 w-14 -translate-x-1/2 rounded-full border border-white/30 bg-white/18 shadow-[0_14px_28px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-[top] duration-75 sm:h-16 sm:w-16"
                                style={{ top: `calc(${leftThumbOffset} - 1.75rem)` }}
                            >
                                <div className="absolute inset-[0.42rem] rounded-full border border-white/30 bg-sky-100/20" />
                            </div>
                        </div>
                    </div>

                    <div className="flex h-full flex-col justify-end pb-3">
                        <div className="mx-auto mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                            Progress
                        </div>
                        <div className="mx-auto w-full max-w-[170px] rounded-full border border-white/12 bg-black/25 p-1.5 backdrop-blur-sm">
                            <div className="h-1.5 rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 transition-all duration-100"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className="relative h-40 rounded-[2rem] border border-orange-200/30 bg-orange-500/18 px-4 py-4 text-white shadow-[0_18px_40px_rgba(194,65,12,0.25)] backdrop-blur-md sm:h-48"
                        onPointerDown={handleRightPointerDown}
                        onPointerMove={handleRightPointerMove}
                        onPointerUp={handleRightPointerEnd}
                        onPointerCancel={handleRightPointerEnd}
                        onLostPointerCapture={handleRightPointerEnd}
                        onContextMenu={(event) => event.preventDefault()}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.28em] text-white/50">Right Zone</div>
                                <div className="mt-1 text-sm font-black uppercase tracking-[0.2em]">Drive</div>
                            </div>
                            <div className="rounded-full border border-white/12 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                                {driveReadout}
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-x-4 bottom-4 top-16 rounded-[1.6rem] border border-white/10 bg-black/18">
                            <div className="absolute inset-x-5 top-4 flex justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                <span>Brake</span>
                                <span>{Math.round(brake * 100)}%</span>
                            </div>
                            <div className="absolute bottom-4 inset-x-5 flex justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                <span>Throttle</span>
                                <span>{Math.round(throttle * 100)}%</span>
                            </div>
                            <div className="absolute bottom-1/2 left-5 right-5 h-px bg-white/16" />
                            <div className="absolute bottom-4 top-4 left-1/2 w-px -translate-x-1/2 bg-white/8" />
                            <div
                                className="absolute left-1/2 h-14 w-14 -translate-x-1/2 rounded-full border border-white/30 bg-white/18 shadow-[0_14px_28px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-[top] duration-75 sm:h-16 sm:w-16"
                                style={{ top: `calc(${rightThumbOffset} - 1.75rem)` }}
                            >
                                <div className="absolute inset-[0.42rem] rounded-full border border-white/30 bg-orange-100/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {crashed && (
                <div className="absolute inset-0 pointer-events-auto flex items-center justify-center bg-[#671111]/60 backdrop-blur-md">
                    <div className="rounded-[2rem] border border-white/12 bg-black/40 px-10 py-8 text-center text-white shadow-[0_32px_90px_rgba(0,0,0,0.38)]">
                        <div className="text-5xl font-black tracking-[0.18em] text-orange-200">CRASH</div>
                        <p className="mt-3 text-sm uppercase tracking-[0.28em] text-white/45">Wheel came up too far</p>
                        <p className="mt-6 text-lg font-semibold text-white/80">Score {score.toLocaleString()}</p>
                        <p className="mt-1 text-sm text-white/55">Distance {distance}m</p>
                        <button
                            onClick={handleRestart}
                            className="mt-7 rounded-full bg-orange-400 px-8 py-3 text-sm font-black uppercase tracking-[0.24em] text-slate-950 transition hover:bg-orange-300 active:scale-95"
                        >
                            Retry
                        </button>
                        <p className="mt-3 text-xs text-white/35">Press R to restart</p>
                    </div>
                </div>
            )}

            {finished && (
                <div className="absolute inset-0 pointer-events-auto flex items-center justify-center bg-emerald-950/55 backdrop-blur-md">
                    <div className="rounded-[2rem] border border-white/12 bg-black/40 px-10 py-8 text-center text-white shadow-[0_32px_90px_rgba(0,0,0,0.38)]">
                        <div className="text-5xl font-black tracking-[0.18em] text-amber-100">FINISH</div>
                        <p className="mt-3 text-sm uppercase tracking-[0.28em] text-white/45">Clean run to the end</p>
                        <p className="mt-6 text-lg font-semibold text-white/80">Final score {score.toLocaleString()}</p>
                        <p className="mt-1 text-sm text-white/55">Distance {ROAD_LENGTH}m</p>
                        <button
                            onClick={handleRestart}
                            className="mt-7 rounded-full bg-amber-300 px-8 py-3 text-sm font-black uppercase tracking-[0.24em] text-slate-950 transition hover:bg-amber-200 active:scale-95"
                        >
                            Run Again
                        </button>
                        <p className="mt-3 text-xs text-white/35">Press R to restart</p>
                    </div>
                </div>
            )}

            {!crashed && !finished && speed === 0 && distance === 0 && (
                <div className="absolute inset-0 flex items-center justify-center px-6">
                    <div className="rounded-[1.8rem] border border-white/12 bg-black/38 px-7 py-6 text-center text-white shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-md">
                        <p className="text-lg font-black uppercase tracking-[0.18em] text-amber-100">Ride the sweet spot</p>
                        <p className="mt-2 text-sm text-white/70">Left thumb shifts rider weight. Right thumb pushes down for throttle and up for brake.</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/40">Keyboard: A/D weight, W/Up throttle, S/Down brake</p>
                    </div>
                </div>
            )}
        </div>
    )
}
