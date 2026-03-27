export default function GameOverlays({
    crashed,
    finished,
    speed,
    distance,
    score,
    roadLength,
    onRestart,
}) {
    return (
        <>
            {crashed && (
                <div className="absolute inset-0 pointer-events-auto flex items-center justify-center bg-[#671111]/60 backdrop-blur-md">
                    <div className="rounded-[2rem] border border-white/12 bg-black/40 px-10 py-8 text-center text-white shadow-[0_32px_90px_rgba(0,0,0,0.38)]">
                        <div className="text-5xl font-black tracking-[0.18em] text-orange-200">CRASH</div>
                        <p className="mt-3 text-sm uppercase tracking-[0.28em] text-white/45">Wheel came up too far</p>
                        <p className="mt-6 text-lg font-semibold text-white/80">Score {score.toLocaleString()}</p>
                        <p className="mt-1 text-sm text-white/55">Distance {distance}m</p>
                        <button
                            onClick={onRestart}
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
                        <p className="mt-1 text-sm text-white/55">Distance {roadLength}m</p>
                        <button
                            onClick={onRestart}
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
        </>
    )
}
