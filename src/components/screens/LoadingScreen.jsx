import { useEffect, useState } from 'react'
import { goToScreen, SCREENS } from '../../store/useUIStore'

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let frame
        let start = null
        const duration = 2800

        function animate(timestamp) {
            if (!start) start = timestamp
            const elapsed = timestamp - start
            const pct = Math.min((elapsed / duration) * 100, 100)
            setProgress(pct)

            if (pct < 100) {
                frame = requestAnimationFrame(animate)
            } else {
                setTimeout(() => goToScreen(SCREENS.WELCOME), 400)
            }
        }

        frame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frame)
    }, [])

    return (
        <div className="game-screen" style={{ justifyContent: 'center', gap: '2rem' }}>
            {/* Decorative glow behind logo */}
            <div
                style={{
                    position: 'absolute',
                    top: '25%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Logo */}
            <div className="animate-fade-in-scale" style={{ textAlign: 'center' }}>
                <img
                    src="/images/logo.png"
                    alt="Wheelie Legend"
                    style={{
                        width: 'min(280px, 70vw)',
                        height: 'auto',
                        filter: 'drop-shadow(0 4px 30px rgba(255,107,0,0.3))',
                    }}
                />
            </div>

            {/* Loading Bar */}
            <div
                className="animate-fade-in"
                style={{
                    width: 'min(300px, 75vw)',
                    animationDelay: '0.3s',
                    opacity: 0,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '100%',
                            borderRadius: '10px',
                            background: 'linear-gradient(90deg, #FF6B00, #FF8C33, #FFB74D)',
                            boxShadow: '0 0 16px rgba(255,107,0,0.5)',
                            transition: 'width 0.1s linear',
                        }}
                    />
                </div>
                <p
                    style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        fontSize: '0.7rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.35)',
                        fontFamily: 'var(--font-game)',
                    }}
                >
                    Loading{'.'.repeat(Math.floor((progress / 100) * 3) + 1)}
                </p>
            </div>
        </div>
    )
}
