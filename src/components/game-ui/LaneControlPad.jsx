const ArrowLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
    </svg>
)

const ArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
)

export default function LaneControlPad({ laneIndex, laneCount, onSwitchLane }) {
    const dots = Array.from({ length: laneCount }, (_, i) => i)

    return (
        <div
            style={{
                position: 'relative',
                height: '5.25rem',
                width: '10.75rem',
                borderRadius: '1.45rem',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                background: 'rgba(56, 189, 248, 0.12)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '0.625rem',
                color: 'white',
                boxShadow: '0 10px 30px rgba(14, 116, 144, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div
                style={{
                    fontSize: '0.55rem',
                    fontFamily: 'var(--font-game)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.45)',
                    width: '100%',
                }}
            >
                Lane
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.55rem',
                    flex: 1,
                }}
            >
                <button
                    onPointerDown={(e) => { e.stopPropagation(); onSwitchLane(-1) }}
                    disabled={laneIndex <= 0}
                    style={{
                        width: '3rem',
                        height: '2.5rem',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: laneIndex <= 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.12)',
                        color: laneIndex <= 0 ? 'rgba(255,255,255,0.2)' : 'white',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: laneIndex <= 0 ? 'default' : 'pointer',
                        flexShrink: 0,
                    }}
                >
                    <ArrowLeft />
                </button>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.35rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '2.5rem',
                        flex: 1,
                    }}
                >
                    {dots.map((i) => (
                        <div
                            key={i}
                            style={{
                                width: i === laneIndex ? '0.55rem' : '0.35rem',
                                height: i === laneIndex ? '0.55rem' : '0.35rem',
                                borderRadius: '50%',
                                background: i === laneIndex ? '#38bdf8' : 'rgba(255,255,255,0.25)',
                                transition: 'all 150ms ease',
                                boxShadow: i === laneIndex ? '0 0 6px rgba(56,189,248,0.5)' : 'none',
                            }}
                        />
                    ))}
                </div>

                <button
                    onPointerDown={(e) => { e.stopPropagation(); onSwitchLane(1) }}
                    disabled={laneIndex >= laneCount - 1}
                    style={{
                        width: '3rem',
                        height: '2.5rem',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: laneIndex >= laneCount - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.12)',
                        color: laneIndex >= laneCount - 1 ? 'rgba(255,255,255,0.2)' : 'white',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: laneIndex >= laneCount - 1 ? 'default' : 'pointer',
                        flexShrink: 0,
                    }}
                >
                    <ArrowRight />
                </button>
            </div>
        </div>
    )
}
