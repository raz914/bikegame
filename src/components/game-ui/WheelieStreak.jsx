import { useEffect, useRef, useState } from 'react'

/**
 * Shows "WHEELIE!" text below the HUD when the player maintains a wheelie
 * for more than 2 seconds. Displays live score with multiplier that increases
 * every 10 meters of consistent wheelie distance.
 */
export default function WheelieStreak({ wheelieValid, wheelieDistance, score }) {
    const [visible, setVisible] = useState(false)
    const [streakScore, setStreakScore] = useState(0)
    const wheelieStartTimeRef = useRef(null)
    const prevWheelieValidRef = useRef(false)
    const streakBaseScoreRef = useRef(0)

    useEffect(() => {
        // Wheelie just started
        if (wheelieValid && !prevWheelieValidRef.current) {
            wheelieStartTimeRef.current = Date.now()
            streakBaseScoreRef.current = score
            setVisible(false)
        }

        // Wheelie just ended
        if (!wheelieValid && prevWheelieValidRef.current) {
            wheelieStartTimeRef.current = null
            setVisible(false)
        }

        prevWheelieValidRef.current = wheelieValid
    }, [wheelieValid, score])

    useEffect(() => {
        if (!wheelieValid) return

        const interval = setInterval(() => {
            if (!wheelieStartTimeRef.current) return
            const elapsed = Date.now() - wheelieStartTimeRef.current
            if (elapsed >= 2000) {
                setVisible(true)
                setStreakScore(score - streakBaseScoreRef.current)
            }
        }, 100)

        return () => clearInterval(interval)
    }, [wheelieValid, score])

    // Multiplier: 1x base, +1x for every 10m of wheelie distance
    const multiplier = 1 + Math.floor(wheelieDistance / 10)

    if (!visible) return null

    return (
        <div
            className="animate-fade-in-scale"
            style={{
                textAlign: 'center',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
            }}
        >
            {/* WHEELIE! text */}
            <div
                style={{
                    fontFamily: 'var(--font-game)',
                    fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#FFD54F',
                    textShadow: '0 2px 12px rgba(255,213,79,0.5), 0 0 40px rgba(255,213,79,0.2)',
                    lineHeight: 1,
                }}
            >
                Wheelie!
            </div>

            {/* Score + Multiplier */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                }}
            >
                <span
                    style={{
                        fontFamily: 'var(--font-game)',
                        fontSize: 'clamp(1rem, 4vw, 1.4rem)',
                        color: 'white',
                        fontVariantNumeric: 'tabular-nums',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }}
                >
                    +{streakScore.toLocaleString()}
                </span>
                {multiplier > 1 && (
                    <span
                        style={{
                            fontFamily: 'var(--font-game)',
                            fontSize: 'clamp(0.8rem, 3vw, 1.1rem)',
                            color: multiplier >= 5 ? '#FF6B00' : multiplier >= 3 ? '#FFB74D' : '#FFD54F',
                            background: multiplier >= 5
                                ? 'rgba(255,107,0,0.2)'
                                : multiplier >= 3
                                    ? 'rgba(255,183,77,0.15)'
                                    : 'rgba(255,213,79,0.12)',
                            border: `1px solid ${multiplier >= 5 ? 'rgba(255,107,0,0.4)' : multiplier >= 3 ? 'rgba(255,183,77,0.3)' : 'rgba(255,213,79,0.25)'}`,
                            borderRadius: '50px',
                            padding: '0.1rem 0.5rem',
                            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        x{multiplier}
                    </span>
                )}
            </div>

            {/* Wheelie distance */}
            <span
                style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.1em',
                }}
            >
                {wheelieDistance}m wheelie
            </span>
        </div>
    )
}
