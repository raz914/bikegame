import { returnToMenu } from '../../store/useUIStore'

const CrashIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="#FF6B00">
        <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    </svg>
)
const TrophyIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="#FFD54F">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
)
const StarIcon = ({ filled }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? '#FFD54F' : 'rgba(255,255,255,0.12)'} style={filled ? { filter: 'drop-shadow(0 2px 6px rgba(255,213,79,0.5))' } : {}}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
)

export default function GameOverlays({
    crashed,
    crashKind,
    finished,
    speed,
    distance,
    score,
    roadLength,
    onRestart,
    isArcade,
    arcadeCoins,
}) {
    if (!crashed && !finished) return null

    const isCrash = crashed
    const title = isCrash ? 'CRASH!' : 'FINISH!'
    const subtitle = isCrash
        ? isArcade && crashKind === 'obstacle'
            ? 'Hit an obstacle!'
            : crashKind === 'forward'
                ? 'Braked too hard and tipped forward!'
                : 'Wheel came up too far!'
        : isArcade
            ? `Collected ${arcadeCoins ?? 0} coins!`
            : 'Clean run to the end!'
    const bgColor = isCrash
        ? 'rgba(100, 15, 15, 0.65)'
        : 'rgba(10, 60, 30, 0.6)'
    const accentColor = isCrash ? '#FF6B00' : '#FFD54F'

    // Simple star rating based on score
    const maxScore = roadLength * 10
    const ratio = Math.min(score / maxScore, 1)
    const stars = ratio > 0.7 ? 3 : ratio > 0.35 ? 2 : ratio > 0.1 ? 1 : 0

    function handleMenu() {
        onRestart()
        returnToMenu()
    }

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: bgColor,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                zIndex: 50,
                pointerEvents: 'auto',
                padding: '1.5rem',
            }}
        >
            <div
                className="animate-fade-in-scale"
                style={{
                    width: '100%',
                    maxWidth: '340px',
                    background: 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.98) 100%)',
                    border: `1px solid rgba(255,255,255,0.1)`,
                    borderRadius: '1.5rem',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative glow at top */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '200px',
                        height: '100px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
                        pointerEvents: 'none',
                    }}
                />

                {/* Icon */}
                <div style={{ marginBottom: '0.5rem' }}>{isCrash ? <CrashIcon /> : <TrophyIcon />}</div>

                {/* Title */}
                <h2
                    className="game-title"
                    style={{
                        fontSize: '2rem',
                        margin: 0,
                        color: accentColor,
                        textShadow: `0 2px 16px ${accentColor}40`,
                    }}
                >
                    {title}
                </h2>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.45)',
                        margin: '0.5rem 0 0',
                        fontFamily: 'var(--font-ui)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}
                >
                    {subtitle}
                </p>

                {/* Stars */}
                <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            style={{
                                transition: 'all 0.3s ease',
                                transitionDelay: `${n * 0.15}s`,
                            }}
                        >
                            <StarIcon filled={n <= stars} />
                        </div>
                    ))}
                </div>

                {/* Stats Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        margin: '1rem 0',
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 0.5rem',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '0.55rem',
                                fontFamily: 'var(--font-game)',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.35)',
                            }}
                        >
                            Score
                        </div>
                        <div
                            style={{
                                fontSize: '1.3rem',
                                fontFamily: 'var(--font-game)',
                                color: 'white',
                                marginTop: '0.2rem',
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {score.toLocaleString()}
                        </div>
                    </div>

                    <div
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 0.5rem',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '0.55rem',
                                fontFamily: 'var(--font-game)',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.35)',
                            }}
                        >
                            Distance
                        </div>
                        <div
                            style={{
                                fontSize: '1.3rem',
                                fontFamily: 'var(--font-game)',
                                color: 'white',
                                marginTop: '0.2rem',
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {distance}m
                        </div>
                    </div>

                    <div
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 0.5rem',
                            border: '1px solid rgba(255,255,255,0.06)',
                            gridColumn: isArcade ? '1' : 'span 2',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '0.55rem',
                                fontFamily: 'var(--font-game)',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.35)',
                            }}
                        >
                            Speed at {isCrash ? 'crash' : 'finish'}
                        </div>
                        <div
                            style={{
                                fontSize: '1.1rem',
                                fontFamily: 'var(--font-game)',
                                color: 'white',
                                marginTop: '0.2rem',
                            }}
                        >
                            {speed} km/h
                        </div>
                    </div>
                    {isArcade && (
                        <div
                            style={{
                                background: 'rgba(255,213,79,0.06)',
                                borderRadius: '0.75rem',
                                padding: '0.75rem 0.5rem',
                                border: '1px solid rgba(255,213,79,0.15)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '0.55rem',
                                    fontFamily: 'var(--font-game)',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,213,79,0.6)',
                                }}
                            >
                                Coins
                            </div>
                            <div
                                style={{
                                    fontSize: '1.3rem',
                                    fontFamily: 'var(--font-game)',
                                    color: '#FFD54F',
                                    marginTop: '0.2rem',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {arcadeCoins ?? 0}
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1.25rem' }}>
                    <button
                        className="game-btn game-btn-primary"
                        onClick={onRestart}
                        style={{ width: '100%', fontSize: '1rem' }}
                    >
                        {isCrash ? 'Retry' : 'Play Again'}
                    </button>
                    <button
                        className="game-btn game-btn-dark"
                        onClick={handleMenu}
                        style={{ width: '100%', fontSize: '0.85rem' }}
                    >
                        Menu
                    </button>
                </div>

                {/* Keyboard hint */}
                <p
                    style={{
                        fontSize: '0.6rem',
                        color: 'rgba(255,255,255,0.2)',
                        marginTop: '0.75rem',
                        fontFamily: 'var(--font-ui)',
                    }}
                >
                    Press R to restart
                </p>
            </div>
        </div>
    )
}
