import ProgressTrack from './ProgressTrack'

export default function GameHUD({
    speed,
    wheelieAngle,
    perfectBalance,
    score,
    sweetSpotText,
    distance,
    roadLength,
    wheelieDistance,
    bestScore,
    progressPct,
    angleColor,
}) {
    return (
        <div className="p-3 sm:p-5 flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-[112px] rounded-[1.1rem] border border-white/12 bg-black/40 px-3 py-2.5 text-white shadow-[0_20px_48px_rgba(0,0,0,0.26)] backdrop-blur-md sm:min-w-[132px] sm:rounded-[1.35rem] sm:px-4 sm:py-3 sm:shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Speed</div>
                <div className="mt-1 text-2xl font-black tabular-nums leading-none sm:text-3xl">
                    {speed}
                    <span className="ml-1 text-sm font-medium text-white/45">km/h</span>
                </div>
                <div className="mt-2.5 text-[10px] uppercase tracking-[0.28em] text-white/45 sm:mt-3">Balance</div>
                <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
                    <span className="text-lg font-bold tabular-nums sm:text-xl" style={{ color: angleColor }}>
                        {wheelieAngle}°
                    </span>
                    {perfectBalance && (
                        <span className="rounded-full border border-amber-300/40 bg-amber-300/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                            Sweet
                        </span>
                    )}
                </div>
            </div>

            <div className="min-w-[118px] rounded-[1.1rem] border border-white/12 bg-black/40 px-3 py-2.5 text-right text-white shadow-[0_20px_48px_rgba(0,0,0,0.26)] backdrop-blur-md sm:min-w-[142px] sm:rounded-[1.35rem] sm:px-4 sm:py-3 sm:shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Score</div>
                <div className="mt-1 text-2xl font-black tabular-nums leading-none sm:text-3xl">{score.toLocaleString()}</div>
                <div className="mt-2.5 text-[10px] uppercase tracking-[0.28em] text-white/45 sm:mt-3">Sweet Spot</div>
                <div className="mt-1 text-sm font-semibold text-amber-100">{sweetSpotText}</div>
                <div className="mt-2 text-xs text-white/45">{distance}m / {roadLength}m</div>
                <div className="mt-1 text-xs text-white/45">Wheelie {wheelieDistance}m · Best {bestScore.toLocaleString()}</div>
                <div className="mt-2 sm:hidden">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Progress</div>
                    <ProgressTrack progressPct={progressPct} compact className="mt-1" />
                </div>
            </div>
        </div>
    )
}
