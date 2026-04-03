import { goToScreen, SCREENS } from '../../store/useUIStore'

/* Simple inline SVG icons — no emojis */
const PlayIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M8 5v14l11-7z" />
    </svg>
)
const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M19.14 12.94a7.07 7.07 0 0 0 .06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.04 7.04 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.3.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
    </svg>
)
const TrophyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
)

export default function MainMenuScreen() {
    return (
        <div
            className="game-screen"
            style={{
                justifyContent: 'space-between',
                padding: '2rem 1.25rem',
            }}
        >
            {/* Top Section - Logo */}
            <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                {/* Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '15%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <img
                    src="/images/logo.png"
                    alt="Wheelie Legend"
                    className="animate-fade-in-scale"
                    style={{
                        width: 'min(240px, 60vw)',
                        height: 'auto',
                        filter: 'drop-shadow(0 4px 20px rgba(255,107,0,0.25))',
                    }}
                />
            </div>

            {/* Center - Menu Buttons */}
            <div
                className="animate-slide-up"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.875rem',
                    width: '100%',
                    maxWidth: '320px',
                    alignSelf: 'center',
                }}
            >
                <button
                    className="game-btn game-btn-primary"
                    onClick={() => goToScreen(SCREENS.MODE_SELECT)}
                    style={{ fontSize: '1.15rem', padding: '1rem 2rem' }}
                >
                    <PlayIcon />
                    Play
                </button>

                <button
                    className="game-btn game-btn-dark"
                    onClick={() => goToScreen(SCREENS.SETTINGS)}
                    style={{ fontSize: '0.85rem', padding: '0.75rem 1.5rem' }}
                >
                    <SettingsIcon />
                    Settings
                </button>

                <button
                    className="game-btn game-btn-dark"
                    style={{ fontSize: '0.85rem', padding: '0.75rem 1.5rem' }}
                >
                    <TrophyIcon />
                    Leaderboard
                </button>
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <div className="ad-banner-slot">Ad Space</div>
            </div>
        </div>
    )
}
