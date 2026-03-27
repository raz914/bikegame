export default function ProgressTrack({ progressPct, compact = false, className = '' }) {
    const containerClassName = compact
        ? 'rounded-full border border-white/12 bg-black/25 p-1 backdrop-blur-sm'
        : 'rounded-full border border-white/12 bg-black/25 p-1.5 backdrop-blur-sm'

    const barClassName = compact ? 'h-1.5 rounded-full bg-white/10' : 'h-1.5 rounded-full bg-white/10'

    return (
        <div className={`${containerClassName} ${className}`.trim()}>
            <div className={barClassName}>
                <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 transition-all duration-100"
                    style={{ width: `${progressPct}%` }}
                />
            </div>
        </div>
    )
}
