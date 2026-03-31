import { goToScreen, SCREENS } from '../../store/useUIStore'

export default function WelcomeScreen() {
    return (
        <div
            className="game-screen"
            onClick={() => goToScreen(SCREENS.MENU)}
            style={{
                justifyContent: 'space-between',
                cursor: 'pointer',
                padding: '2rem 1rem',
            }}
        >
            {/* Version */}
            <p
                style={{
                    alignSelf: 'flex-start',
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.2)',
                    fontFamily: 'var(--font-ui)',
                    letterSpacing: '0.1em',
                }}
            >
                v0.1.0
            </p>

            {/* Center Content */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
                {/* Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '30%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '350px',
                        height: '350px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Logo */}
                <div className="animate-fade-in-scale">
                    <img
                        src="/images/logo.png"
                        alt="Wheelie Legend"
                        style={{
                            width: 'min(320px, 75vw)',
                            height: 'auto',
                            filter: 'drop-shadow(0 4px 30px rgba(255,107,0,0.3))',
                        }}
                    />
                </div>

                {/* Tap to Start */}
                <p
                    className="game-title animate-pulse-glow"
                    style={{
                        fontSize: 'clamp(1rem, 4vw, 1.4rem)',
                        letterSpacing: '0.3em',
                    }}
                >
                    Tap to Start
                </p>
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <div className="ad-banner-slot">Ad Space</div>
            </div>
        </div>
    )
}
