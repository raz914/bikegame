const VARIANT_STYLES = {
    weight: {
        outer: 'border-sky-300/30 bg-sky-500/14 shadow-[0_14px_28px_rgba(14,116,144,0.18)] sm:bg-sky-500/18 sm:shadow-[0_18px_40px_rgba(14,116,144,0.22)]',
        thumb: 'bg-sky-100/18 sm:bg-sky-100/20',
    },
    drive: {
        outer: 'border-orange-200/30 bg-orange-500/14 shadow-[0_14px_28px_rgba(194,65,12,0.18)] sm:bg-orange-500/18 sm:shadow-[0_18px_40px_rgba(194,65,12,0.25)]',
        thumb: 'bg-orange-100/18 sm:bg-orange-100/20',
    },
}

export default function ControlPad({
    variant,
    alignClassName,
    mobileLabel,
    zoneLabel,
    label,
    readout,
    topLabel,
    topValue,
    bottomLabel,
    bottomValue,
    thumbOffset,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
}) {
    const styles = VARIANT_STYLES[variant]

    return (
        <div
            className={`relative h-[8.75rem] w-[5.25rem] rounded-[1.45rem] border px-2.5 py-3 text-white backdrop-blur-md sm:h-48 sm:w-auto sm:rounded-[2rem] sm:px-4 sm:py-4 ${alignClassName} ${styles.outer}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onLostPointerCapture={onLostPointerCapture}
            onContextMenu={(event) => event.preventDefault()}
        >
            <div className="flex items-start justify-between sm:hidden">
                <div className="text-[9px] font-black uppercase tracking-[0.28em] text-white/55">{mobileLabel}</div>
            </div>
            <div className="hidden items-start justify-between sm:flex">
                <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-white/50">{zoneLabel}</div>
                    <div className="mt-1 text-sm font-black uppercase tracking-[0.2em]">{label}</div>
                </div>
                <div className="rounded-full border border-white/12 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    {readout}
                </div>
            </div>
            <div className="pointer-events-none absolute inset-x-2.5 bottom-3 top-8 rounded-[1rem] border border-white/10 bg-black/14 sm:inset-x-4 sm:bottom-4 sm:top-16 sm:rounded-[1.6rem] sm:bg-black/18">
                <div className="hidden absolute inset-x-5 top-4 justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:flex">
                    <span>{topLabel}</span>
                    <span>{topValue}</span>
                </div>
                <div className="hidden absolute bottom-4 inset-x-5 justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:flex">
                    <span>{bottomLabel}</span>
                    <span>{bottomValue}</span>
                </div>
                <div className="absolute bottom-2.5 top-2.5 left-1/2 w-px -translate-x-1/2 bg-white/14 sm:bottom-4 sm:top-4 sm:bg-white/8" />
                <div
                    className="absolute left-1/2 h-9 w-9 -translate-x-1/2 rounded-full border border-white/25 bg-white/16 shadow-[0_10px_20px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-[top] duration-75 sm:h-16 sm:w-16 sm:border-white/30 sm:bg-white/18 sm:shadow-[0_14px_28px_rgba(0,0,0,0.22)]"
                    style={{ top: thumbOffset }}
                >
                    <div className={`absolute inset-[0.28rem] rounded-full border border-white/25 sm:inset-[0.42rem] sm:border-white/30 ${styles.thumb}`} />
                </div>
            </div>
        </div>
    )
}
