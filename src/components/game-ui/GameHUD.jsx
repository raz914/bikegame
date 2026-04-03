import ProgressTrack from './ProgressTrack'

function CoinIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="#FFD54F" />
            <circle cx="12" cy="12" r="6.5" fill="#FFB300" opacity="0.45" />
            <path
                d="M12 7.5c-2.05 0-3.75 1.34-3.75 3.1 0 1.83 1.66 2.45 3.34 2.84 1.53.36 2.41.63 2.41 1.48 0 .73-.77 1.29-1.93 1.29-1.08 0-2.01-.44-2.73-1.15l-1.18 1.4c.84.87 1.96 1.42 3.22 1.58V20h1.34v-1.9c2.1-.22 3.46-1.55 3.46-3.22 0-1.95-1.67-2.57-3.45-2.99-1.39-.32-2.3-.56-2.3-1.38 0-.69.71-1.15 1.76-1.15.94 0 1.72.32 2.38.88l1.08-1.46c-.76-.67-1.75-1.11-2.93-1.24V5h-1.34v1.34z"
                fill="#FFF8E1"
            />
        </svg>
    )
}

export default function GameHUD({
    speed,
    wheelieAngle,
    balanceMode,
    perfectBalance,
    score,
    progressPct,
    angleColor,
}) {
    const showAngle = Math.abs(wheelieAngle) > 3
    const angleLabel = balanceMode === 'stoppie' ? 'STOPPIE' : 'WHEELIE'

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

                {/* Center: Angle */}
                {showAngle && (
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
                            {Math.abs(wheelieAngle)}°
                        </span>
                        <span
                            style={{
                                fontSize: '0.5rem',
                                fontFamily: 'var(--font-game)',
                                letterSpacing: '0.1em',
                                color: 'rgba(255,255,255,0.45)',
                            }}
                        >
                            {angleLabel}
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                    }}
                >
                    <CoinIcon />
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
