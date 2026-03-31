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
        <div
            style={{
                width: '100%',
                pointerEvents: 'none',
            }}
        >
            {/* Thin progress bar at very top */}
            <div style={{ width: '100%', padding: '0', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
                <ProgressTrack progressPct={progressPct} compact />
            </div>

            {/* Minimal HUD row */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '0.4rem 0.625rem 0',
                }}
            >
                {/* Left: Speed */}
                <div
                    style={{
                        background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius: '0.625rem',
                        padding: '0.35rem 0.6rem',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.2rem',
                    }}
                >
                    <span
                        style={{
                            fontSize: '1.25rem',
                            fontFamily: 'var(--font-game)',
                            fontWeight: 900,
                            lineHeight: 1,
                            color: 'white',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {speed}
                    </span>
                    <span
                        style={{
                            fontSize: '0.5rem',
                            fontFamily: 'var(--font-ui)',
                            color: 'rgba(255,255,255,0.35)',
                        }}
                    >
                        km/h
                    </span>
                </div>

                {/* Center: Angle (only when doing wheelie) */}
                {wheelieAngle > 3 && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.6rem',
                            background: 'rgba(0,0,0,0.45)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            borderRadius: '0.625rem',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '1rem',
                                fontFamily: 'var(--font-game)',
                                fontWeight: 700,
                                color: angleColor,
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {wheelieAngle}°
                        </span>
                        {perfectBalance && (
                            <span
                                style={{
                                    fontSize: '0.5rem',
                                    fontFamily: 'var(--font-game)',
                                    letterSpacing: '0.1em',
                                    color: '#FFD54F',
                                    background: 'rgba(255,213,79,0.15)',
                                    border: '1px solid rgba(255,213,79,0.3)',
                                    borderRadius: '50px',
                                    padding: '0.1rem 0.4rem',
                                }}
                            >
                                SWEET
                            </span>
                        )}
                    </div>
                )}

                {/* Right: Score */}
                <div
                    style={{
                        background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius: '0.625rem',
                        padding: '0.35rem 0.6rem',
                        border: '1px solid rgba(255,255,255,0.06)',
                        textAlign: 'right',
                    }}
                >
                    <span
                        style={{
                            fontSize: '1.25rem',
                            fontFamily: 'var(--font-game)',
                            fontWeight: 900,
                            lineHeight: 1,
                            color: 'white',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {score.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    )
}
