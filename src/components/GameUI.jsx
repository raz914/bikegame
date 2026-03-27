import { useCallback, useEffect } from 'react'
import {
    useGameStore,
    useGameState,
    ROAD_LENGTH,
    PERFECT_WHEELIE_ANGLE,
    PERFECT_WHEELIE_WINDOW,
} from '../store/useGameStore'

export default function GameUI() {
    const store = useGameStore()
    const speed = useGameState((s) => Math.floor(s.speed))
    const score = useGameState((s) => s.score)
    const bestScore = useGameState((s) => s.bestScore)
    const distance = useGameState((s) => s.distance)
    const wheelieDistance = useGameState((s) => Math.floor(s.wheelieDistance))
    const wheelieAngle = useGameState((s) => Math.floor(s.wheelieAngle))
    const perfectBalance = useGameState((s) => s.perfectBalance)
    const crashed = useGameState((s) => s.crashed)
    const finished = useGameState((s) => s.finished)

    const handleWheelieUp = useCallback((active) => {
        store.setState((prev) => ({
            ...prev,
            throttle: active ? 1 : 0,
            riderWeight: active ? -0.55 : (prev.brake > 0 ? 0.7 : 0),
        }))
    }, [store])

    const handleWheelieDown = useCallback((active) => {
        store.setState((prev) => ({
            ...prev,
            brake: active ? 0.82 : 0,
            riderWeight: active ? 0.7 : (prev.throttle > 0 ? -0.55 : 0),
        }))
    }, [store])

    const handleRestart = useCallback(() => {
        store.reset()
    }, [store])

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'ArrowUp' || event.key === 'w' || event.key === ' ') {
                event.preventDefault()
                handleWheelieUp(true)
            }
            if (event.key === 'ArrowDown' || event.key === 's') {
                event.preventDefault()
                handleWheelieDown(true)
            }
            if (event.key === 'r' && (crashed || finished)) {
                handleRestart()
            }
        }

        const onKeyUp = (event) => {
            if (event.key === 'ArrowUp' || event.key === 'w' || event.key === ' ') {
                handleWheelieUp(false)
            }
            if (event.key === 'ArrowDown' || event.key === 's') {
                handleWheelieDown(false)
            }
        }

        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [store, crashed, finished, handleRestart, handleWheelieDown, handleWheelieUp])

    const progressPct = Math.min((distance / ROAD_LENGTH) * 100, 100)
    const angleColor = wheelieAngle > 52 ? '#ef4444' : wheelieAngle > 36 ? '#f59e0b' : '#f8fafc'
    const sweetSpotText = `${PERFECT_WHEELIE_ANGLE - PERFECT_WHEELIE_WINDOW}°-${PERFECT_WHEELIE_ANGLE + PERFECT_WHEELIE_WINDOW}°`

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
                <div className="mx-auto grid max-w-md grid-cols-[92px_minmax(120px,1fr)_104px] items-end gap-3 sm:max-w-lg sm:grid-cols-[104px_minmax(160px,1fr)_116px]">
                    <button
                        className="h-24 rounded-[1.6rem] border border-sky-300/35 bg-sky-500/75 text-white shadow-[0_18px_40px_rgba(14,116,144,0.32)] backdrop-blur-md transition active:scale-95 active:bg-sky-400 sm:h-28"
                        onPointerDown={() => handleWheelieDown(true)}
                        onPointerUp={() => handleWheelieDown(false)}
                        onPointerLeave={() => handleWheelieDown(false)}
                        onContextMenu={(event) => event.preventDefault()}
                    >
                        <div className="flex flex-col items-center justify-center">
                            <svg className="mb-1 h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">Brake</span>
                        </div>
                    </button>

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

                    <button
                        className="h-28 rounded-[1.8rem] border border-orange-200/35 bg-orange-500/80 text-white shadow-[0_18px_40px_rgba(194,65,12,0.35)] backdrop-blur-md transition active:scale-95 active:bg-orange-400 sm:h-32"
                        onPointerDown={() => handleWheelieUp(true)}
                        onPointerUp={() => handleWheelieUp(false)}
                        onPointerLeave={() => handleWheelieUp(false)}
                        onContextMenu={(event) => event.preventDefault()}
                    >
                        <div className="flex flex-col items-center justify-center">
                            <svg className="mb-1 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                            <span className="text-xs font-black uppercase tracking-[0.28em]">Throttle</span>
                        </div>
                    </button>
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
                        <p className="mt-2 text-sm text-white/70">Use throttle to lift, then feather brake to settle while Phase 1 analog state runs under the hood.</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/40">Keyboard: W / Up throttle, S / Down brake</p>
                    </div>
                </div>
            )}
        </div>
    )
}
